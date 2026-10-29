import { jsPDF } from 'jspdf'

const TURN_COLORS = { A: '#7030A0', B: '#274E13', C: '#FF0000', D: '#1155CC', E: '#00FFFF', F: '#FF00FF' }
const format = new Intl.NumberFormat('es-AR')
const percentFormat = new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const hexToRgb = (hex) => {
  const value = hex.replace('#', '')
  return [Number.parseInt(value.slice(0, 2), 16), Number.parseInt(value.slice(2, 4), 16), Number.parseInt(value.slice(4, 6), 16)]
}

const formatDate = (date) => {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

export const calculateCompliance = ({ totalEvents, assignedResources }) => totalEvents ? assignedResources / totalEvents * 100 : 0

const drawCard = (pdf, { x, y, label, value, color }) => {
  const width = 84
  const height = 44
  pdf.setFillColor(250, 252, 253); pdf.roundedRect(x, y, width, height, 3, 3, 'F')
  pdf.setDrawColor(222, 231, 237); pdf.setLineWidth(.35); pdf.roundedRect(x, y, width, height, 3, 3, 'S')
  pdf.setFillColor(...color); pdf.roundedRect(x, y, width, 4, 2.7, 2.7, 'F')
  pdf.setTextColor(91, 112, 130); pdf.setFontSize(7.1); pdf.setFont('helvetica', 'bold')
  pdf.text(pdf.splitTextToSize(label, 71), x + 6, y + 14)
  pdf.setTextColor(29, 51, 73); pdf.setFontSize(20); pdf.setFont('helvetica', 'bold')
  pdf.text(value, x + 6, y + 34)
}

export function downloadTwoDayResourcePdf(period, data) {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const color = hexToRgb(TURN_COLORS[data.shift])
  const compliance = calculateCompliance(data)

  pdf.setFillColor(...color); pdf.rect(0, 0, 210, 32, 'F')
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(19); pdf.setFont('helvetica', 'bold'); pdf.text('INFORME', 14, 14)
  pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.text(`Turno ${data.shift} · Recurso asignado`, 14, 22)
  pdf.setTextColor(35, 49, 64); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold')
  pdf.text(`Período: ${formatDate(period.startDate)} y ${formatDate(period.endDate)}`, 14, 45)
  pdf.setDrawColor(...color); pdf.setLineWidth(.7); pdf.line(14, 51, 196, 51)
  pdf.setFontSize(12); pdf.text('RECURSOS ASIGNADOS', 14, 64)

  const cards = [
    { label: 'TOTAL DE EVENTOS', value: format.format(data.totalEvents), x: 14, y: 72 },
    { label: 'TOTAL DE MÓVILES ASIGNADOS', value: format.format(data.assignedResources), x: 112, y: 72 },
    { label: 'TOTAL DE MÓVILES SIN ASIGNAR', value: format.format(data.unassignedResources), x: 14, y: 126 },
    { label: 'PORCENTAJE DE ASIGNACIÓN', value: `${percentFormat.format(compliance)}%`, x: 112, y: 126 },
  ]
  cards.forEach((card) => drawCard(pdf, { ...card, color }))

  pdf.setTextColor(110, 128, 144); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal')
  pdf.text(`Informe de recursos · Turno ${data.shift}`, 14, 289)
  pdf.text('Página 1 de 1', 176, 289)
  pdf.save(`informe-recursos-turno-${data.shift.toLowerCase()}-${period.startDate}_${period.endDate}.pdf`)
}
