import * as XLSX from 'xlsx'
import { normalizeText } from './excel.js'

const findColumn = (headers, aliases) => headers.findIndex((header) => {
  const normalized = normalizeText(header)
  return aliases.some((alias) => normalized === alias || normalized.includes(alias))
})

const text = (value) => String(value ?? '').trim()

const parseDate = (value) => {
  const label = text(value)
  const match = label.match(/(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{2,4})/)
  if (!match) return { label, month: 'Sin fecha', sortDate: '9999-99-99' }
  const day = Number(match[1])
  const monthNumber = Number(match[2])
  const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3])
  const month = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(new Date(year, monthNumber - 1, day))
  return {
    label,
    month: month[0].toUpperCase() + month.slice(1),
    sortDate: `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

export function parseIncidentReports(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  if (!worksheet) return []
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false })
  const headers = rows[0] ?? []
  const columns = {
    number: findColumn(headers, ['n']),
    date: findColumn(headers, ['fecha']),
    zone: findColumn(headers, ['zona']),
    staffing: findColumn(headers, ['dotacion']),
    domain: findColumn(headers, ['dominio']),
    primaryRole: findColumn(headers, ['rol de combate efectivo 1 mayor jerarquia']),
    secondaryRole: findColumn(headers, ['rol de combate efectivo 2']),
    pdf: findColumn(headers, ['pdf adjunto']),
    resolution: findColumn(headers, ['resolucion']),
    resolutionReport: findColumn(headers, ['informe de la resolucion']),
    consultationDate: findColumn(headers, ['fecha consulta']),
  }

  return rows.slice(1).map((row, index) => {
    const number = text(row[columns.number])
    if (!number) return null
    const date = parseDate(row[columns.date])
    return {
      id: `seguimiento-${number}-${index}`,
      number,
      date: date.label,
      month: date.month,
      sortDate: date.sortDate,
      zone: text(row[columns.zone]) || 'Sin zona',
      staffing: text(row[columns.staffing]) || 'Sin dotación',
      domain: text(row[columns.domain]) || 'Sin dominio',
      primaryRole: text(row[columns.primaryRole]) || 'Sin consignar',
      secondaryRole: text(row[columns.secondaryRole]) || 'Sin consignar',
      pdf: text(row[columns.pdf]),
      resolution: text(row[columns.resolution]),
      resolutionReport: text(row[columns.resolutionReport]),
      consultationDate: text(row[columns.consultationDate]),
    }
  }).filter(Boolean)
}
