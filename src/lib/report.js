import { jsPDF } from 'jspdf'

const TURNOS = ['A', 'B', 'C', 'D', 'E', 'F']
const TURN_COLORS = { A: '#7030A0', B: '#274E13', C: '#FF0000', D: '#1155CC', E: '#00FFFF', F: '#FF00FF' }
const TURN_FOREGROUNDS = { A: [255, 255, 255], B: [255, 255, 255], C: [255, 255, 255], D: [255, 255, 255], E: [6, 76, 85], F: [255, 255, 255] }
const format = new Intl.NumberFormat('es-AR')
const percentFormat = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)]
}

const dateFromSortValue = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (date) => `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`

const intervalFor = (record) => {
  const start = dateFromSortValue(record.sortDate)
  if (!start) return null
  let end = start
  if (record.kind === 'consolidated' && Number.isFinite(record.rangeEnd)) {
    end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), record.rangeEnd))
    if (end < start) end.setUTCMonth(end.getUTCMonth() + 1)
  } else if (record.kind === 'consolidated' && record.coveredDates?.length) {
    end = dateFromSortValue(record.coveredDates.at(-1)) || start
  }
  return { start, end }
}

const periodBoundsFor = (records) => {
  const intervals = records.map(intervalFor).filter(Boolean)
  if (!intervals.length) return null
  return intervals.reduce((bounds, interval) => ({
    start: interval.start < bounds.start ? interval.start : bounds.start,
    end: interval.end > bounds.end ? interval.end : bounds.end,
  }), { start: intervals[0].start, end: intervals[0].end })
}

const totalsFor = (records) => records.reduce((totals, record) => ({
  systemAlerts: totals.systemAlerts + record.systemAlerts,
  auditedAlerts: totals.auditedAlerts + record.auditedAlerts,
  notAudited: totals.notAudited + record.notAudited,
  reports: totals.reports + record.reports,
  incompleteObservations: totals.incompleteObservations + record.incompleteObservations,
}), { systemAlerts: 0, auditedAlerts: 0, notAudited: 0, reports: 0, incompleteObservations: 0 })

const representedDaysFor = (record) => {
  if (record.kind !== 'consolidated') return 1
  if (record.coveredDates?.length) return record.coveredDates.length
  const interval = intervalFor(record)
  return interval ? Math.max(1, Math.round((interval.end - interval.start) / 86_400_000)) : 1
}

const auditorCountFor = (record) => record.auditorList?.length || String(record.auditors || '').split(/[,;/]+/).map((auditor) => auditor.trim()).filter(Boolean).length

const auditorAverageFor = (records) => {
  const days = records.reduce((total, record) => total + representedDaysFor(record), 0)
  const auditorDays = records.reduce((total, record) => total + auditorCountFor(record) * representedDaysFor(record), 0)
  return days ? auditorDays / (days * 3) * 100 : 0
}

export const calculateShiftPdfSummary = (records) => {
  const bounds = periodBoundsFor(records)
  const totals = totalsFor(records)
  return {
    period: bounds ? `${formatDate(bounds.start)} al ${formatDate(bounds.end)}` : 'Período no disponible',
    bounds,
    totals: {
      ...totals,
      compliance: totals.systemAlerts ? totals.auditedAlerts / totals.systemAlerts * 100 : 0,
      auditorAverage: auditorAverageFor(records),
    },
  }
}

export const calculateReportsByShift = (records, targetRecords) => {
  const bounds = periodBoundsFor(targetRecords)
  return TURNOS.map((shift) => ({
    shift,
    reports: records.filter((record) => {
      const interval = intervalFor(record)
      return record.shift === shift && interval && bounds && interval.start <= bounds.end && interval.end >= bounds.start
    }).reduce((total, record) => total + record.reports, 0),
  }))
}

const drawMetricCard = (pdf, { x, y, width, label, value, color }) => {
  const height = 36
  pdf.setFillColor(250, 252, 253); pdf.roundedRect(x, y, width, height, 3, 3, 'F')
  pdf.setDrawColor(222, 231, 237); pdf.setLineWidth(.35); pdf.roundedRect(x, y, width, height, 3, 3, 'S')
  pdf.setFillColor(...color); pdf.roundedRect(x, y, width, 3.5, 2.6, 2.6, 'F')
  pdf.setTextColor(91, 112, 130); pdf.setFontSize(7.5); pdf.setFont('helvetica', 'bold')
  pdf.text(label, x + 6, y + 13)
  pdf.setTextColor(29, 51, 73); pdf.setFontSize(18); pdf.setFont('helvetica', 'bold')
  pdf.text(value, x + 6, y + 27)
}

const drawReportCard = (pdf, { x, y, shift, reports }) => {
  const color = hexToRgb(TURN_COLORS[shift])
  pdf.setFillColor(250, 252, 253); pdf.roundedRect(x, y, 56, 19, 2.5, 2.5, 'F')
  pdf.setDrawColor(222, 231, 237); pdf.setLineWidth(.3); pdf.roundedRect(x, y, 56, 19, 2.5, 2.5, 'S')
  pdf.setFillColor(...color); pdf.roundedRect(x, y, 56, 5, 2.2, 2.2, 'F')
  pdf.setTextColor(...TURN_FOREGROUNDS[shift]); pdf.setFontSize(7); pdf.setFont('helvetica', 'bold'); pdf.text(`TURNO ${shift}`, x + 5, y + 3.5)
  pdf.setTextColor(29, 51, 73); pdf.setFontSize(14); pdf.text(format.format(reports), x + 5, y + 14.2)
}

const drawObservation = (pdf, observation, color, shift, startY) => {
  if (!observation?.trim()) return
  let y = startY
  const lines = [...pdf.splitTextToSize(observation.trim(), 168)]
  while (lines.length) {
    if (y + 6 + 24 > 279) {
      pdf.addPage()
      pdf.setFillColor(...color); pdf.rect(0, 0, 210, 20, 'F')
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.text(`Informe de Auditoría Móviles - Turno ${shift}`, 14, 12)
      y = 31
    }
    const maxLines = Math.max(1, Math.floor((279 - (y + 6) - 15) / 5))
    const chunk = lines.splice(0, maxLines)
    const height = Math.max(24, chunk.length * 5 + 15)
    pdf.setTextColor(35, 49, 64); pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.text('OBSERVACIÓN', 14, y)
    pdf.setFillColor(250, 252, 253); pdf.roundedRect(14, y + 6, 182, height, 3, 3, 'F')
    pdf.setDrawColor(...color); pdf.setLineWidth(.35); pdf.roundedRect(14, y + 6, 182, height, 3, 3, 'S')
    pdf.setTextColor(55, 75, 92); pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.text(chunk, 21, y + 16)
    if (!lines.length) break
    pdf.addPage()
    pdf.setFillColor(...color); pdf.rect(0, 0, 210, 20, 'F')
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(12); pdf.setFont('helvetica', 'bold'); pdf.text(`Informe de Auditoría Móviles - Turno ${shift}`, 14, 12)
    y = 31
  }
}

export function downloadShiftPdf(shift, records, color, comparisonRecords, observation) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const rgb = hexToRgb(color)
  const { period, totals } = calculateShiftPdfSummary(records)
  const reportsByShift = calculateReportsByShift(comparisonRecords, records)

  pdf.setFillColor(...rgb); pdf.rect(0, 0, 210, 32, 'F')
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(18); pdf.setFont('helvetica', 'bold'); pdf.text(`Informe de Auditoría Móviles - Turno ${shift}`, 14, 14)
  pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.text('Resumen ejecutivo del período', 14, 22)
  pdf.setTextColor(35, 49, 64); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.text(`Período: ${period}`, 14, 43)
  pdf.setDrawColor(...rgb); pdf.setLineWidth(.7); pdf.line(14, 49, 196, 49)

  pdf.setFontSize(11); pdf.text('RESUMEN DEL TURNO', 14, 59)
  const cards = [
    { label: 'ALERTAS DEL SISTEMA', value: format.format(totals.systemAlerts), x: 14, y: 65, width: 56 },
    { label: 'ALERTAS AUDITADAS', value: format.format(totals.auditedAlerts), x: 77, y: 65, width: 56 },
    { label: 'NO AUDITADAS', value: format.format(totals.notAudited), x: 140, y: 65, width: 56 },
    { label: 'CUMPLIMIENTO', value: `${percentFormat.format(totals.compliance)}%`, x: 14, y: 108, width: 56 },
    { label: 'INFORMES', value: format.format(totals.reports), x: 77, y: 108, width: 56 },
    { label: 'OBS. INCOMPLETAS', value: format.format(totals.incompleteObservations), x: 140, y: 108, width: 56 },
    { label: 'PROM. AUDITORES', value: `${percentFormat.format(totals.auditorAverage)}%`, x: 77, y: 151, width: 56 },
  ]
  cards.forEach((card) => drawMetricCard(pdf, { ...card, color: rgb }))

  pdf.setTextColor(35, 49, 64); pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.text('INFORMES POR TURNO', 14, 202)
  reportsByShift.forEach((item, index) => drawReportCard(pdf, { ...item, x: 14 + (index % 3) * 63, y: 209 + Math.floor(index / 3) * 24 }))
  drawObservation(pdf, observation, rgb, shift, 263)

  const pages = pdf.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page); pdf.setTextColor(110, 128, 144); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal')
    pdf.text(`Auditoría 2026 · Turno ${shift}`, 14, 289)
    pdf.text(`Página ${page} de ${pages}`, 176, 289)
  }
  pdf.save(`informe-auditoria-moviles-turno-${shift.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
