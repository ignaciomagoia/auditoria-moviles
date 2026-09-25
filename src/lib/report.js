import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

const format = new Intl.NumberFormat('es-AR')

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)]
}

export function downloadShiftPdf(shift, records, filters, color) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const period = [filters.month !== 'Todos' && filters.month, filters.week !== 'Todas' && filters.week, filters.auditor !== 'Todos' && filters.auditor].filter(Boolean).join(' · ') || 'Todos los registros'
  const rgb = hexToRgb(color)

  pdf.setFillColor(...rgb); pdf.rect(0, 0, 210, 31, 'F')
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(18); pdf.text(`Informe de Auditoría - Turno ${shift}`, 14, 14)
  pdf.setFontSize(9); pdf.text('Informe operativo', 14, 21)
  pdf.setTextColor(35, 49, 64); pdf.setFontSize(10); pdf.text(`Período seleccionado: ${period}`, 14, 41)
  pdf.setDrawColor(...rgb); pdf.setLineWidth(.7); pdf.line(14, 46, 196, 46)

  autoTable(pdf, {
    startY: 53,
    head: [['Semana / fecha', 'Auditores', 'Franja horaria', 'Alertas sistema', 'Alertas auditadas', 'No auditadas', '% Cumplimiento', 'Informes', 'Obs. incompletas']],
    body: records.map((record) => [
      `${record.dateLabel}${record.kind === 'consolidated' ? ' (semana cerrada)' : `\n${record.week}`}`,
      record.auditors,
      record.schedule,
      format.format(record.systemAlerts),
      format.format(record.auditedAlerts),
      format.format(record.notAudited),
      `${record.compliance.toFixed(1)}%`,
      format.format(record.reports),
      format.format(record.incompleteObservations),
    ]),
    styles: { fontSize: 6.8, cellPadding: 1.8, overflow: 'linebreak', textColor: [35, 49, 64] },
    headStyles: { fillColor: rgb, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 45 }, 2: { cellWidth: 18 } },
    margin: { left: 10, right: 10 },
  })
  const pages = pdf.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page); pdf.setTextColor(110, 128, 144); pdf.setFontSize(8)
    pdf.text(`Auditoría 2026 · Turno ${shift}`, 14, 289)
    pdf.text(`Página ${page} de ${pages}`, 176, 289)
  }
  pdf.save(`informe-auditoria-2026-turno-${shift.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf`)
}
