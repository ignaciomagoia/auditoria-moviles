import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Download, RotateCcw } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { excludeReplacedDailyRecords, parseWorkbook } from './lib/excel'
import { downloadShiftPdf } from './lib/report'

const TURNOS = ['A', 'B', 'C', 'D', 'E', 'F']
const TURN_COLORS = { A: '#7030A0', B: '#274E13', C: '#FF0000', D: '#1155CC', E: '#00FFFF', F: '#FF00FF' }
const TURN_FOREGROUNDS = { A: '#FFFFFF', B: '#FFFFFF', C: '#FFFFFF', D: '#FFFFFF', E: '#064C55', F: '#FFFFFF' }
const TURN_INKS = { A: '#7030A0', B: '#274E13', C: '#D00000', D: '#1155CC', E: '#087B83', F: '#C000A9' }
const format = new Intl.NumberFormat('es-AR')

const totalsOf = (records) => {
  const systemAlerts = records.reduce((sum, record) => sum + record.systemAlerts, 0)
  const auditedAlerts = records.reduce((sum, record) => sum + record.auditedAlerts, 0)
  return { compliance: systemAlerts ? auditedAlerts / systemAlerts * 100 : 0 }
}

function Filters({ records, filters, setFilters }) {
  const options = {
    month: ['Todos', ...Array.from(new Set(records.map((record) => record.month))).sort()],
    week: ['Todas', ...Array.from(new Set(records.map((record) => record.week))).sort((a, b) => a.localeCompare(b, 'es'))],
    auditor: ['Todos', ...Array.from(new Set(records.flatMap((record) => record.auditorList))).sort((a, b) => a.localeCompare(b, 'es'))],
  }
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }))
  return <div className="filters simplified-filters">
    <label>Mes / período<select value={filters.month} onChange={update('month')}>{options.month.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Semana<select value={filters.week} onChange={update('week')}>{options.week.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Auditor<select value={filters.auditor} onChange={update('auditor')}>{options.auditor.map((item) => <option key={item}>{item}</option>)}</select></label>
    <button className="clear" onClick={() => setFilters({ month: 'Todos', week: 'Todas', auditor: 'Todos' })}><RotateCcw size={16} /> Limpiar filtros</button>
  </div>
}

function ShiftBlocks({ records, onRequestPdf }) {
  return <section className="shift-list" aria-label="Resultados por turno">
    {TURNOS.map((shift) => {
      const shiftRecords = records.filter((record) => record.shift === shift)
      return <article className="shift-block" style={{ '--turn-color': TURN_COLORS[shift], '--turn-foreground': TURN_FOREGROUNDS[shift], '--turn-ink': TURN_INKS[shift] }} key={shift}>
        <header className="shift-heading"><span className="shift-tag">{shift}</span><h2>Turno {shift}</h2><span className="record-count">{shiftRecords.length} {shiftRecords.length === 1 ? 'registro' : 'registros'}</span><button className="turn-pdf" disabled={!shiftRecords.length} onClick={() => onRequestPdf(shift, shiftRecords)}><Download size={15} /> Descargar PDF</button></header>
        {shiftRecords.length ? <div className="shift-rows">{shiftRecords.map((record) => <ShiftRow key={record.id} record={record} />)}</div> : <p className="no-records">No hay registros para los filtros seleccionados.</p>}
      </article>
    })}
  </section>
}

function ShiftRow({ record }) {
  return <div className="shift-row">
    <div className="record-date"><span>Semana / fecha</span><b>{record.dateLabel}</b><small>{record.kind === 'consolidated' ? 'Semana cerrada' : record.week}</small></div>
    <div className="record-auditors"><span>Auditores</span><b>{record.auditors}</b></div>
    <div><span>Franja horaria</span><b>{record.schedule}</b></div>
    <div><span>Alertas sistema</span><b>{format.format(record.systemAlerts)}</b></div>
    <div><span>Alertas auditadas</span><b>{format.format(record.auditedAlerts)}</b></div>
    <div><span>No auditadas</span><b>{format.format(record.notAudited)}</b></div>
    <div className="compliance"><span>% Cumplimiento</span><b>{record.compliance.toFixed(1)}%</b></div>
    <div><span>Informes</span><b>{format.format(record.reports)}</b></div>
    <div><span>Obs. incompletas</span><b>{format.format(record.incompleteObservations)}</b></div>
  </div>
}

function Charts({ records }) {
  const byShift = TURNOS.map((shift) => ({ name: shift, cumplimiento: Number(totalsOf(records.filter((record) => record.shift === shift)).compliance.toFixed(1)) }))
  const byWeek = Object.entries(records.reduce((groups, record) => { (groups[record.week] ||= []).push(record); return groups }, {})).map(([week, items]) => ({ week, cumplimiento: Number(totalsOf(items).compliance.toFixed(1)), order: Math.min(...items.map((item) => item.sortDate)) })).sort((a, b) => a.order.localeCompare(b.order))
  return <section className="charts-grid simple-charts">
    <ChartCard title="Cumplimiento por turno"><ResponsiveContainer><BarChart data={byShift}><CartesianGrid vertical={false} stroke="#e6edf3" /><XAxis dataKey="name" /><YAxis domain={[0, 100]} unit="%" /><Tooltip formatter={(value) => `${value}%`} /><Bar dataKey="cumplimiento" fill="#1d7a8c" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
    <ChartCard title="Evolución del cumplimiento por semana"><ResponsiveContainer><LineChart data={byWeek}><CartesianGrid vertical={false} stroke="#e6edf3" /><XAxis dataKey="week" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} unit="%" /><Tooltip formatter={(value) => `${value}%`} /><Line type="monotone" dataKey="cumplimiento" stroke="#102a43" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></ChartCard>
  </section>
}

function ChartCard({ title, children }) { return <article className="panel chart"><h2>{title}</h2><div className="chart-body">{children}</div></article> }

function PdfModal({ request, observation, onObservationChange, onCancel, onGenerate }) {
  if (!request) return null
  return <div className="pdf-modal-backdrop" role="presentation"><section className="pdf-modal" role="dialog" aria-modal="true" aria-labelledby="pdf-modal-title"><h2 id="pdf-modal-title">Generar informe - Turno {request.shift}</h2><label htmlFor="pdf-observation">Observación del informe</label><textarea id="pdf-observation" value={observation} onChange={(event) => onObservationChange(event.target.value)} placeholder="Escriba una observación para incluir en el informe..." rows="5" autoFocus /><div className="modal-actions"><button className="modal-cancel" onClick={onCancel}>Cancelar</button><button className="primary" onClick={onGenerate}>Generar PDF</button></div></section></div>
}

export default function App() {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({ month: 'Todos', week: 'Todas', auditor: 'Todos' })
  const [pdfRequest, setPdfRequest] = useState(null)
  const [pdfObservation, setPdfObservation] = useState('')
  useEffect(() => { fetch('/auditoria-2026.xlsx', { cache: 'no-store' }).then((response) => response.ok ? response.arrayBuffer() : Promise.reject()).then((buffer) => setRecords(parseWorkbook(buffer).records)).catch(() => {}) }, [])
  const availableRecords = useMemo(() => excludeReplacedDailyRecords(records), [records])
  const periodRecords = useMemo(() => availableRecords.filter((record) => (filters.month === 'Todos' || record.month === filters.month) && (filters.week === 'Todas' || record.week === filters.week)).sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.shift.localeCompare(b.shift)), [availableRecords, filters.month, filters.week])
  const filtered = useMemo(() => periodRecords.filter((record) => filters.auditor === 'Todos' || record.auditorList.includes(filters.auditor)), [periodRecords, filters.auditor])
  const requestPdf = (shift, shiftRecords) => { setPdfObservation(''); setPdfRequest({ shift, records: shiftRecords }) }
  const generatePdf = () => { if (!pdfRequest) return; downloadShiftPdf(pdfRequest.shift, pdfRequest.records, TURN_COLORS[pdfRequest.shift], periodRecords, pdfObservation); setPdfRequest(null); setPdfObservation('') }
  return <><Header active="dashboard" /><main className="app-shell"><section className="intro"><div><p className="eyebrow">Control operativo · 2026</p><h1>Auditoría de móviles</h1><p>Seguimiento de alertas y cumplimiento por turno.</p></div></section><Filters records={availableRecords} filters={filters} setFilters={setFilters} /><ShiftBlocks records={filtered} onRequestPdf={requestPdf} /><Charts records={filtered} /></main><PdfModal request={pdfRequest} observation={pdfObservation} onObservationChange={setPdfObservation} onCancel={() => { setPdfRequest(null); setPdfObservation('') }} onGenerate={generatePdf} /></>
}

function Header() { return <header className="topbar"><a className="brand" href="/"><span className="brand-mark"><BarChart3 size={19} /></span><span>Auditoría <b>2026</b></span></a></header> }
