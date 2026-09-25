import * as XLSX from 'xlsx'

const HEADER_ALIASES = {
  date: ['fecha', 'periodo', 'periodo fecha', 'semana'],
  auditors: ['auditores', 'auditor', 'responsable', 'responsables'],
  schedule: ['franja horaria', 'franja', 'horario', 'turno horario'],
  systemAlerts: ['alertas sistema', 'alertas de sistema', 'alertas del sistema', 'alertas sist'],
  auditedAlerts: ['alertas auditadas', 'alertras auditadas', 'alerta auditada'],
  notAudited: ['no auditadas', 'alertas no auditadas', 'no auditada'],
  compliance: ['cumplimiento', '% cumplimiento', 'porcentaje cumplimiento'],
  reports: ['cantidad de informes', 'cantidad informes', 'informes', 'cantidad de informres'],
  incompleteObservations: ['campos de observaciones incompletos', 'campos de observaciones incompletas', 'observaciones incompletas', 'observaciones incompletos'],
}

export const normalizeText = (value = '') => String(value)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9%]+/g, ' ').trim()

const findColumn = (headers, aliases) => headers.findIndex((header) => {
  const normalized = normalizeText(header)
  return aliases.some((alias) => normalized === alias || normalized.includes(alias))
})

const number = (value) => {
  if (typeof value === 'number') return value
  if (value === undefined || value === null || value === '') return 0
  const parsed = Number(String(value).replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const dateLabel = (value, cell) => {
  if (cell?.w) return cell.w.trim()
  if (value instanceof Date && !Number.isNaN(value)) return `${String(value.getDate()).padStart(2, '0')}/${String(value.getMonth() + 1).padStart(2, '0')}`
  return String(value ?? '').trim()
}

const parsePeriod = (value, year = 2026) => {
  const text = String(value ?? '').trim()
  const range = text.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})/)
  if (range) return { month: 'Período consolidado', sortDate: `${year}-99-${String(range[1]).padStart(2, '0')}`, isConsolidated: true, startDay: Number(range[1]), endDay: Number(range[2]) }
  const match = text.match(/(\d{1,2})\s*[/.-]\s*(\d{1,2})(?:\s*[/.-]\s*(\d{2,4}))?/)
  if (!match) return { month: 'Sin fecha', sortDate: `${year}-99-99`, isConsolidated: true }
  const first = Number(match[1])
  const second = Number(match[2])
  const fullYear = match[3] ? Number(match[3].length === 2 ? `20${match[3]}` : match[3]) : year
  const month = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(new Date(fullYear, second - 1, first))
  return { month: month[0].toUpperCase() + month.slice(1), sortDate: `${fullYear}-${String(second).padStart(2, '0')}-${String(first).padStart(2, '0')}`, isConsolidated: false }
}

const weekFrom = (label, parsed) => parsed.isConsolidated ? label : (() => {
  const date = new Date(`${parsed.sortDate}T12:00:00`)
  const day = date.getDay() || 7
  const start = new Date(date); start.setDate(date.getDate() - day + 1)
  const end = new Date(start); end.setDate(start.getDate() + 6)
  const stamp = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
  return `${stamp(start)} – ${stamp(end)}`
})()

export function parseWorkbook(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const records = []
  const warnings = []
  workbook.SheetNames.forEach((sheetName) => {
    const shift = sheetName.match(/turno\s*([a-f])/i)
    if (!shift) return
    const worksheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: true })
    const headers = rows[0] || []
    const cols = Object.fromEntries(Object.entries(HEADER_ALIASES).map(([key, aliases]) => [key, findColumn(headers, aliases)]))
    if (cols.date < 0 || cols.systemAlerts < 0 || cols.auditedAlerts < 0) {
      warnings.push(`${sheetName}: faltan encabezados esenciales.`)
      return
    }
    const sheetRecords = []
    rows.slice(1).forEach((row, index) => {
      const rawDate = row[cols.date]
      if (rawDate === null || rawDate === undefined || rawDate === '') return
      const address = XLSX.utils.encode_cell({ r: index + 1, c: cols.date })
      const label = dateLabel(rawDate, worksheet[address])
      const parsed = parsePeriod(label)
      const systemAlerts = number(row[cols.systemAlerts])
      const auditedAlerts = number(row[cols.auditedAlerts])
      if (!systemAlerts && !auditedAlerts) return
      const complianceRaw = cols.compliance >= 0 ? number(row[cols.compliance]) : 0
      sheetRecords.push({
        id: `${sheetName}-${index + 2}-${label}`,
        shift: shift[1].toUpperCase(),
        dateLabel: label,
        week: weekFrom(label, parsed),
        month: parsed.month,
        sortDate: parsed.sortDate,
        kind: parsed.isConsolidated ? 'consolidated' : 'daily',
        sourceRow: index + 2,
        rangeStart: parsed.startDay,
        rangeEnd: parsed.endDay,
        auditors: String(row[cols.auditors] ?? 'Sin asignar').trim(),
        auditorList: String(row[cols.auditors] ?? '').split(/[,;/]+/).map((item) => item.trim()).filter(Boolean),
        schedule: String(row[cols.schedule] ?? '—').trim(),
        systemAlerts,
        auditedAlerts,
        notAudited: cols.notAudited >= 0 ? number(row[cols.notAudited]) : Math.max(0, systemAlerts - auditedAlerts),
        compliance: complianceRaw > 1 ? complianceRaw : complianceRaw * 100,
        reports: cols.reports >= 0 ? number(row[cols.reports]) : 0,
        incompleteObservations: cols.incompleteObservations >= 0 ? number(row[cols.incompleteObservations]) : 0,
      })
    })
    // A closed week is normally written as a day range without month. The closest
    // dated row in that sheet supplies its month/year, so it can replace (never add
    // to) the daily rows that belong to the same seven-day interval.
    sheetRecords.filter((record) => record.kind === 'consolidated' && record.rangeStart).forEach((record) => {
      const nearby = sheetRecords.filter((item) => item.kind === 'daily').sort((a, b) => Math.abs(a.sourceRow - record.sourceRow) - Math.abs(b.sourceRow - record.sourceRow))[0]
      if (!nearby) return
      const [year, month] = nearby.sortDate.split('-').map(Number)
      const start = new Date(year, month - 1, record.rangeStart)
      const end = new Date(start); end.setDate(start.getDate() + 6)
      const day = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
      record.month = nearby.month
      record.sortDate = `${year}-${String(month).padStart(2, '0')}-${String(record.rangeStart).padStart(2, '0')}`
      record.week = `${day(start)} – ${day(end)}`
      record.coveredDates = Array.from({ length: 7 }, (_, offset) => { const date = new Date(start); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` })
    })
    records.push(...sheetRecords)
  })
  return { records, warnings, sheetNames: workbook.SheetNames }
}

export function excludeReplacedDailyRecords(records) {
  const closedIntervals = records.filter((record) => record.kind === 'consolidated' && record.coveredDates?.length)
  return records.filter((record) => record.kind !== 'daily' || !closedIntervals.some((closed) => closed.shift === record.shift && closed.coveredDates.includes(record.sortDate)))
}

export const readExcelFile = async (file) => parseWorkbook(await file.arrayBuffer())
