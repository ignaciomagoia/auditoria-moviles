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

export const formatReportPeriod = ({ startDate, endDate }) => {
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)
  const daysBetween = Math.round((end - start) / 86_400_000)
  const separator = daysBetween === 1 ? 'y' : 'al'
  return `${formatDate(startDate)} ${separator} ${formatDate(endDate)}`
}

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

const drawZoneCard = (pdf, { x, y, width, height = 31, label, value, color }) => {
  pdf.setFillColor(250, 252, 253); pdf.roundedRect(x, y, width, height, 3, 3, 'F')
  pdf.setDrawColor(222, 231, 237); pdf.setLineWidth(.35); pdf.roundedRect(x, y, width, height, 3, 3, 'S')
  pdf.setFillColor(...color); pdf.roundedRect(x, y, width, 3.5, 2.7, 2.7, 'F')
  pdf.setTextColor(91, 112, 130); pdf.setFontSize(5.8); pdf.setFont('helvetica', 'bold')
  pdf.text(pdf.splitTextToSize(label.toUpperCase(), width - 10), x + 5, y + 10)
  pdf.setTextColor(29, 51, 73); pdf.setFontSize(16); pdf.setFont('helvetica', 'bold')
  pdf.text(value, x + 5, y + height - 5)
}

export function downloadTwoDayResourcePdf(period, data, zone = '', operatorName = '') {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const color = hexToRgb(TURN_COLORS[data.shift])
  const compliance = calculateCompliance(data)

  pdf.setFillColor(...color); pdf.rect(0, 0, 210, 32, 'F')
  pdf.setTextColor(255, 255, 255); pdf.setFontSize(19); pdf.setFont('helvetica', 'bold'); pdf.text('INFORME', 14, 14)
  pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.text(`Turno ${data.shift} · Recurso asignado`, 14, 22)
  if (operatorName) { pdf.setTextColor(255, 255, 255); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.text(`Operador: ${operatorName}`, 14, 28) }
  if (zone) { pdf.setTextColor(255, 255, 255); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal'); pdf.text(`Zona ${zone}`, 14, 28) }
  pdf.setTextColor(35, 49, 64); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold')
  pdf.text(`Período: ${formatReportPeriod(period)}`, 14, 45)
  pdf.setDrawColor(...color); pdf.setLineWidth(.7); pdf.line(14, 51, 196, 51)
  pdf.setFontSize(12); pdf.text('RECURSOS ASIGNADOS', 14, 64)

  const cards = [
    { label: 'TOTAL DE EVENTOS', value: format.format(data.totalEvents), x: 14, y: 72 },
    { label: 'TOTAL DE MÓVILES ASIGNADOS', value: format.format(data.assignedResources), x: 112, y: 72 },
    { label: 'TOTAL DE MÓVILES SIN ASIGNAR', value: format.format(data.unassignedResources), x: 14, y: 126 },
    { label: 'PORCENTAJE DE ASIGNACIÓN', value: `${percentFormat.format(compliance)}%`, x: 112, y: 126 },
  ]
  cards.forEach((card) => drawCard(pdf, { ...card, color }))

  const zoneBreakdown = !zone && !operatorName ? period.zoneBreakdown?.[data.shift] : null
  if (zoneBreakdown) {
    const zones = period.zoneNames ?? ['Norte', 'Sur', 'Este', 'Centro/Oeste']
    const zoneCards = zones
      .map((item) => ({ label: item, value: zoneBreakdown[item]?.unassignedResources ?? 0 }))
      .filter((item) => item.label !== 'Distrito sin asociar' || item.value > 0)
    if (!zones.includes('Fuera de cuadrante')) {
      const zonedUnassigned = zones.reduce((sum, item) => sum + (zoneBreakdown[item]?.unassignedResources ?? 0), 0)
      zoneCards.push({ label: 'Fuera de cuadrante', value: data.unassignedResources - zonedUnassigned })
    }

    pdf.setTextColor(35, 49, 64); pdf.setFontSize(11); pdf.setFont('helvetica', 'bold')
    pdf.text(period.zoneSectionTitle ?? 'M\u00d3VILES SIN ASIGNAR POR CUADRANTE', 14, 188)
    const compactLayout = zoneCards.length > 5
    const positions = compactLayout
      ? zoneCards.map((_, index) => ({ x: 14 + (index % 5) * 36.9, y: 196 + Math.floor(index / 5) * 31 }))
      : [{ x: 14, y: 196 }, { x: 77, y: 196 }, { x: 140, y: 196 }, { x: 45.5, y: 235 }, { x: 108.5, y: 235 }]
    zoneCards.forEach((item, index) => drawZoneCard(pdf, {
      ...positions[index],
      width: compactLayout ? 34.4 : 56,
      height: compactLayout ? 25 : 31,
      label: item.label,
      value: format.format(item.value),
      color,
    }))
  }

  pdf.setTextColor(110, 128, 144); pdf.setFontSize(8); pdf.setFont('helvetica', 'normal')
  pdf.text(`Informe de recursos · Turno ${data.shift}`, 14, 289)
  pdf.text('Página 1 de 1', 176, 289)
  const zoneFileName = zone ? `-zona-${zone.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''
  const subjectFileName = operatorName ? `operador-${operatorName.replace(/[^a-z0-9]+/gi, '-')}` : `turno-${data.shift.toLowerCase()}`
  pdf.save(`informe-recursos-${subjectFileName}${zoneFileName}-${period.startDate}_${period.endDate}.pdf`)
}
