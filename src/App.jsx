import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, ChevronDown, ChevronUp, Download, RotateCcw } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { excludeReplacedDailyRecords, normalizeText, parseWorkbook } from './lib/excel'
import { downloadShiftPdf } from './lib/report'
import { twoDayResourceReports } from './data/twoDayResourceReports.js'
import { resourceOperatorsByPeriod } from './data/resourceOperators.js'
import { calculateCompliance, downloadTwoDayResourcePdf } from './lib/twoDayResourceReport.js'
import { parseIncidentReports } from './lib/incidentReports.js'

const TURNOS = ['A', 'B', 'C', 'D', 'E', 'F']
const TURN_COLORS = { A: '#7030A0', B: '#274E13', C: '#FF0000', D: '#1155CC', E: '#00FFFF', F: '#FF00FF' }
const TURN_FOREGROUNDS = { A: '#FFFFFF', B: '#FFFFFF', C: '#FFFFFF', D: '#FFFFFF', E: '#064C55', F: '#FFFFFF' }
const TURN_INKS = { A: '#7030A0', B: '#274E13', C: '#D00000', D: '#1155CC', E: '#087B83', F: '#C000A9' }
const format = new Intl.NumberFormat('es-AR')
// Los datos del Excel se solicitan en cada carga para mostrar la última semana publicada.

const totalsOf = (records) => {
  const systemAlerts = records.reduce((sum, record) => sum + record.systemAlerts, 0)
  const auditedAlerts = records.reduce((sum, record) => sum + record.auditedAlerts, 0)
  return { compliance: systemAlerts ? auditedAlerts / systemAlerts * 100 : 0 }
}

function Filters({ records, filters, setFilters, view, setView }) {
  const options = {
    month: ['Todos', ...Array.from(new Set(records.map((record) => record.month))).sort()],
    week: ['Todas', ...Array.from(new Set(records.map((record) => record.week))).sort((a, b) => a.localeCompare(b, 'es'))],
    auditor: ['Todos', ...Array.from(new Set(records.flatMap((record) => record.auditorList))).sort((a, b) => a.localeCompare(b, 'es'))],
  }
  const update = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }))
  return <div className={`filters simplified-filters ${view === 'incident-follow-up' ? 'follow-up-switcher' : ''}`}>
    <label>Contenido<select value={view} onChange={(event) => setView(event.target.value)}><option value="two-day-reports">Informes de recursos</option><option value="incident-follow-up">Seguimiento de informes</option></select></label>
    {view === 'incident-follow-up' ? <p className="filter-help">Consulte informes por período, zona, dotación, dominio, efectivo o estado de resolución.</p> : <><label>Mes / período<select value={filters.month} onChange={update('month')}>{options.month.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Semana<select value={filters.week} onChange={update('week')}>{options.week.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label>Auditor<select value={filters.auditor} onChange={update('auditor')}>{options.auditor.map((item) => <option key={item}>{item}</option>)}</select></label>
    <button className="clear" onClick={() => setFilters({ month: 'Todos', week: 'Todas', auditor: 'Todos' })}><RotateCcw size={16} /> Limpiar filtros</button></>}
  </div>
}

function FollowUpReports() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', month: 'Todos', zone: 'Todas', staffing: '', role: '', resolution: 'Todas', recurrence: 'Todas' })
  const [expandedMatchId, setExpandedMatchId] = useState('')

  useEffect(() => {
    fetch('/seguimiento-informes.xlsx', { cache: 'no-store' })
      .then((response) => response.ok ? response.arrayBuffer() : Promise.reject())
      .then((buffer) => setRecords(parseIncidentReports(buffer)))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }, [])

  const options = useMemo(() => ({
    month: ['Todos', ...Array.from(new Set(records.map((record) => record.month))).sort((a, b) => a.localeCompare(b, 'es'))],
    zone: ['Todas', ...Array.from(new Set(records.map((record) => record.zone))).sort((a, b) => a.localeCompare(b, 'es'))],
  }), [records])

  const recurrences = useMemo(() => {
    const staffing = new Map()
    const personnel = new Map()
    const pairs = new Map()
    const increment = (map, key) => map.set(key, (map.get(key) ?? 0) + 1)
    const identity = (value) => {
      const normalized = normalizeText(value)
      return normalized === 'sin consignar' || normalized === 'sin dotacion' ? '' : normalized
    }
    records.forEach((record) => {
      const staffingKey = identity(record.staffing)
      const primaryKey = identity(record.primaryRole)
      const secondaryKey = identity(record.secondaryRole)
      if (staffingKey) increment(staffing, staffingKey)
      new Set([primaryKey, secondaryKey].filter(Boolean)).forEach((person) => increment(personnel, person))
      if (primaryKey && secondaryKey) increment(pairs, [primaryKey, secondaryKey].sort().join('|'))
    })
    return { staffing, personnel, pairs, identity }
  }, [records])

  const warningsFor = useCallback((record) => {
    const staffingKey = recurrences.identity(record.staffing)
    const primaryKey = recurrences.identity(record.primaryRole)
    const secondaryKey = recurrences.identity(record.secondaryRole)
    const pairKey = primaryKey && secondaryKey ? [primaryKey, secondaryKey].sort().join('|') : ''
    const warnings = []
    if ((recurrences.staffing.get(staffingKey) ?? 0) >= 2) warnings.push(`Dotación ×${recurrences.staffing.get(staffingKey)}`)
    if ((recurrences.pairs.get(pairKey) ?? 0) >= 2) warnings.push(`Dupla ×${recurrences.pairs.get(pairKey)}`)
    const personnelCount = Math.max(recurrences.personnel.get(primaryKey) ?? 0, recurrences.personnel.get(secondaryKey) ?? 0)
    if (personnelCount >= 2) warnings.push(`Personal ×${personnelCount}`)
    return warnings
  }, [recurrences])

  const relatedGroupsFor = useCallback((record) => {
    const staffingKey = recurrences.identity(record.staffing)
    const primaryKey = recurrences.identity(record.primaryRole)
    const secondaryKey = recurrences.identity(record.secondaryRole)
    const pairKey = primaryKey && secondaryKey ? [primaryKey, secondaryKey].sort().join('|') : ''
    const showType = (type) => filters.recurrence === 'Todas' || filters.recurrence === 'Con advertencias' || filters.recurrence === type
    const groups = []
    if (showType('Dotación repetida') && (recurrences.staffing.get(staffingKey) ?? 0) >= 2) {
      groups.push({ label: `Dotación repetida · ${record.staffing}`, records: records.filter((item) => item.id !== record.id && recurrences.identity(item.staffing) === staffingKey) })
    }
    if (showType('Dupla repetida') && (recurrences.pairs.get(pairKey) ?? 0) >= 2) {
      groups.push({ label: `Dupla repetida · ${record.primaryRole} + ${record.secondaryRole}`, records: records.filter((item) => {
        const itemPrimary = recurrences.identity(item.primaryRole)
        const itemSecondary = recurrences.identity(item.secondaryRole)
        return item.id !== record.id && itemPrimary && itemSecondary && [itemPrimary, itemSecondary].sort().join('|') === pairKey
      }) })
    }
    const personnel = [[primaryKey, record.primaryRole], [secondaryKey, record.secondaryRole]]
    new Map(personnel.filter(([key]) => key).map(([key, label]) => [key, label])).forEach((label, key) => {
      if (!showType('Personal repetido') || (recurrences.personnel.get(key) ?? 0) < 2) return
      groups.push({ label: `Personal repetido · ${label}`, records: records.filter((item) => item.id !== record.id && [recurrences.identity(item.primaryRole), recurrences.identity(item.secondaryRole)].includes(key)) })
    })
    return groups.filter((group) => group.records.length)
  }, [filters.recurrence, records, recurrences])

  const filtered = useMemo(() => {
    const search = normalizeText(filters.search)
    const staffing = normalizeText(filters.staffing)
    const role = normalizeText(filters.role)
    return records.filter((record) => {
      const searchable = normalizeText([record.number, record.date, record.zone, record.staffing, record.domain, record.primaryRole, record.secondaryRole, record.pdf, record.resolution].join(' '))
      const roles = normalizeText(`${record.primaryRole} ${record.secondaryRole}`)
      const warnings = warningsFor(record)
      const matchesRecurrence = filters.recurrence === 'Todas'
        || (filters.recurrence === 'Con advertencias' && warnings.length > 0)
        || (filters.recurrence === 'Dotación repetida' && warnings.some((warning) => warning.startsWith('Dotación')))
        || (filters.recurrence === 'Dupla repetida' && warnings.some((warning) => warning.startsWith('Dupla')))
        || (filters.recurrence === 'Personal repetido' && warnings.some((warning) => warning.startsWith('Personal')))
      return (!search || searchable.includes(search))
        && (filters.month === 'Todos' || record.month === filters.month)
        && (filters.zone === 'Todas' || record.zone === filters.zone)
        && (!staffing || normalizeText(record.staffing).includes(staffing))
        && (!role || roles.includes(role))
        && (filters.resolution === 'Todas' || (filters.resolution === 'Con resolución' ? Boolean(record.resolution) : !record.resolution))
        && matchesRecurrence
    }).sort((a, b) => b.sortDate.localeCompare(a.sortDate) || Number(b.number) - Number(a.number))
  }, [records, filters, warningsFor])

  const update = (key) => (event) => { setFilters((current) => ({ ...current, [key]: event.target.value })); setExpandedMatchId('') }
  const clear = () => { setFilters({ search: '', month: 'Todos', zone: 'Todas', staffing: '', role: '', resolution: 'Todas', recurrence: 'Todas' }); setExpandedMatchId('') }
  const resolved = filtered.filter((record) => record.resolution).length
  const consulted = filtered.filter((record) => record.consultationDate).length
  const recurringRecords = filtered.filter((record) => warningsFor(record).length).length

  return <section className="incident-follow-up" aria-label="Seguimiento de informes">
    <div className="summary-heading"><div><p className="eyebrow">Control operativo</p><h2>Seguimiento de informes</h2><p>Consulta de dotaciones, dominios, efectivos y resoluciones asociadas a cada informe.</p></div></div>
    <div className="incident-filters">
      <label className="incident-search">Búsqueda general<input value={filters.search} onChange={update('search')} placeholder="Nº, dotación, dominio, efectivo o resolución" /></label>
      <label>Período<select value={filters.month} onChange={update('month')}>{options.month.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Zona<select value={filters.zone} onChange={update('zone')}>{options.zone.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>Advertencias<select value={filters.recurrence} onChange={update('recurrence')}><option>Todas</option><option>Con advertencias</option><option>Dotación repetida</option><option>Dupla repetida</option><option>Personal repetido</option></select></label>
      <label>Dotación<input value={filters.staffing} onChange={update('staffing')} placeholder="Ej. COLON 12" /></label>
      <label>Rol de combate<input value={filters.role} onChange={update('role')} placeholder="Nombre o cargo" /></label>
      <label>Resolución<select value={filters.resolution} onChange={update('resolution')}><option>Todas</option><option>Con resolución</option><option>Sin resolución</option></select></label>
      <button className="clear" onClick={clear}><RotateCcw size={16} /> Limpiar búsqueda</button>
    </div>
    {loading ? <p className="summary-empty">Cargando seguimiento de informes…</p> : <>
      <div className="incident-metrics">
        <Metric label="Informes encontrados" value={filtered.length} tone="navy" />
        <Metric label="Con resolución" value={resolved} tone="green" />
        <Metric label="Sin resolución" value={filtered.length - resolved} tone="amber" />
        <Metric label="Con fecha de consulta" value={consulted} tone="blue" />
      </div>
      {recurringRecords > 0 && <p className="recurrence-banner"><AlertTriangle size={18} /><span><b>Advertencia de reincidencia:</b> {recurringRecords} {recurringRecords === 1 ? 'informe con advertencia detectada.' : 'informes con advertencias detectadas.'}</span></p>}
      <div className="incident-table-wrap"><table className="incident-table"><thead><tr><th>Nº</th><th>Fecha</th><th>Zona</th><th>Dotación</th><th>Dominio</th><th>Rol de combate</th><th>Resolución</th><th>Consulta</th></tr></thead><tbody>{filtered.map((record) => {
        const warnings = warningsFor(record)
        const isExpanded = expandedMatchId === record.id
        const relatedGroups = isExpanded ? relatedGroupsFor(record) : []
        return <Fragment key={record.id}>
          <tr><td><div className="report-number"><div><b>{record.number}</b><small>{record.pdf || 'Sin adjunto'}</small></div>{warnings.length > 0 && <button className="match-toggle" onClick={() => setExpandedMatchId(isExpanded ? '' : record.id)} aria-expanded={isExpanded} title="Ver informes relacionados">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>}</div></td><td>{record.date}</td><td><span className="zone-pill">{record.zone}</span></td><td><b>{record.staffing}</b></td><td>{record.domain}</td><td><b>{record.primaryRole}</b>{record.secondaryRole !== 'Sin consignar' && <small>{record.secondaryRole}</small>}</td><td className="resolution-cell" title={record.resolution}>{record.resolution || <span className="pending-resolution">Pendiente</span>}</td><td>{record.consultationDate || '—'}</td></tr>
          {isExpanded && <tr className="related-row"><td colSpan="8"><div className="related-reports"><b>Informes relacionados</b>{relatedGroups.map((group) => <section key={group.label}><strong>{group.label}</strong><div>{group.records.map((item) => <article key={item.id}><span>Informe {item.number}</span><span>{item.date}</span><span>{item.staffing}</span><span>{item.zone}</span></article>)}</div></section>)}{!relatedGroups.length && <span>No hay coincidencias adicionales para el filtro seleccionado.</span>}</div></td></tr>}
        </Fragment>
      })}</tbody></table>{!filtered.length && <p className="summary-empty">No se encontraron informes con esos filtros.</p>}</div>
    </>}
  </section>
}

function Metric({ label, value, tone }) {
  return <article className={`metric ${tone}`}><span>{label}</span><strong>{format.format(value)}</strong></article>
}

function TwoDayResourceReports() {
  const [periodId, setPeriodId] = useState(twoDayResourceReports[0]?.id ?? '')
  const [zone, setZone] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const period = twoDayResourceReports.find((item) => item.id === periodId)
  if (!period) return <section className="two-day-reports" aria-label="Informes de recursos"><div className="summary-heading resource-report-heading"><div><p className="eyebrow">Control operativo</p><h2>Informes de recursos</h2><p>Próximamente se cargarán los datos del 14 y 15 de noviembre.</p></div></div></section>
  const operators = resourceOperatorsByPeriod[period.id] ?? []
  const zoneNames = period.zoneNames ?? ['Norte', 'Sur', 'Este', 'Centro/Oeste']
  const selectedOperator = operators.find((item) => item.id === operatorName)
  const shifts = operators.length ? TURNOS.map((shift) => operators.filter((item) => item.shift === shift).reduce((total, item) => ({
    shift,
    totalEvents: total.totalEvents + item.totalEvents,
    correctlyAssignedResources: total.correctlyAssignedResources + item.correctlyAssignedResources,
    incorrectlyAssignedResources: total.incorrectlyAssignedResources + item.incorrectlyAssignedResources,
    unassignedResources: total.unassignedResources + item.unassignedResources,
  }), { shift, totalEvents: 0, correctlyAssignedResources: 0, incorrectlyAssignedResources: 0, unassignedResources: 0 })).filter((item) => item.totalEvents > 0) : period.shifts.filter((item) => item.totalEvents > 0)
  const selectPeriod = (event) => { setPeriodId(event.target.value); setZone(''); setOperatorName('') }
  const selectZone = (event) => { setZone(event.target.value); setOperatorName('') }
  const selectOperator = (event) => { setOperatorName(event.target.value); setZone('') }
  const cards = selectedOperator ? [selectedOperator] : shifts

  return <section className="two-day-reports" aria-label="Informes de recursos">
    <div className="summary-heading resource-report-heading"><div><p className="eyebrow">Control operativo</p><h2>Informes de recursos</h2><p>Seleccione una franja para consultar y descargar el informe de cada turno u operador.</p></div><div className="resource-report-selects"><label>Franja de fechas<select value={periodId} onChange={selectPeriod}>{twoDayResourceReports.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>{period.zoneBreakdown && <label>Zona<select value={zone} onChange={selectZone}><option value="">Todas las zonas</option>{zoneNames.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}{operators.length > 0 && <label className="resource-operator-picker">Ver por operador<select value={operatorName} onChange={selectOperator}><option value="">Seleccionar operador</option>{operators.map((item) => <option key={item.id} value={item.id}>{item.name} · Turno {item.shift}</option>)}</select></label>}</div></div>
    <div className="resource-report-grid">{cards.map((original) => {
      const zoneData = zone ? period.zoneBreakdown?.[original.shift]?.[zone] : null
      const item = zoneData ? { ...original, ...zoneData } : original
      const compliance = calculateCompliance(item)
      const incorrectPercentage = item.totalEvents ? item.incorrectlyAssignedResources / item.totalEvents * 100 : 0
      const unassignedPercentage = item.totalEvents ? item.unassignedResources / item.totalEvents * 100 : 0
      return <article className="resource-report-card" style={{ '--turn-color': TURN_COLORS[item.shift], '--turn-foreground': TURN_FOREGROUNDS[item.shift], '--turn-ink': TURN_INKS[item.shift] }} key={item.shift}>
        <header><span className="shift-tag">{item.shift}</span><div><h3>{selectedOperator ? item.name : `Turno ${item.shift}`}</h3><p>{selectedOperator ? `Turno ${item.shift} · Recurso asignado` : zone ? `Zona ${zone}` : 'Recurso asignado'}</p></div><button className="turn-pdf" onClick={() => downloadTwoDayResourcePdf(period, item, zone, selectedOperator?.name)}><Download size={15} /> Descargar PDF</button></header>
        <dl><div><dt>Total de eventos</dt><dd>{format.format(item.totalEvents)}</dd></div><div><dt>Asignados correctamente</dt><dd>{format.format(item.correctlyAssignedResources)}</dd></div><div><dt>Asignados incorrectamente</dt><dd>{format.format(item.incorrectlyAssignedResources)}</dd></div><div><dt>Móviles sin asignar</dt><dd>{format.format(item.unassignedResources)}</dd></div><div><dt>% asignación correcta</dt><dd>{compliance.toFixed(1)}%</dd></div><div><dt>% asignación incorrecta</dt><dd>{incorrectPercentage.toFixed(1)}%</dd></div><div><dt>% sin asignar</dt><dd>{unassignedPercentage.toFixed(1)}%</dd></div></dl>
      </article>
    })}</div>
    {zone && period.zoneBreakdownNote && <p className="resource-zone-note">{period.zoneBreakdownNote}</p>}
  </section>
}

/* La vista de asignaciÃ³n independiente fue integrada en Informes de recursos.
function AssignmentAnalysis() {
  const [analysisId, setAnalysisId] = useState(assignmentAnalyses[0]?.id ?? '')
  const [operatorName, setOperatorName] = useState('')
  const [zoneName, setZoneName] = useState('')
  const analysis = assignmentAnalyses.find((item) => item.id === analysisId)
  if (!analysis) return null
  const operator = analysis.operators.find((item) => item.name === operatorName)
  const zone = analysis.zones.find((item) => item.name === zoneName)
  const kind = operator ? 'operator' : zone ? 'zone' : null
  const target = operator || zone
  const percentages = target ? calculateAssignmentPercentages(target) : null
  const metrics = !target ? [] : zone ? [
    { label: 'Total eventos de todas las zonas', value: analysis.totalZoneEvents },
    { label: 'Total eventos de esta zona', value: target.total },
    { label: 'Recursos asignados', value: target.assigned },
    { label: 'Recursos sin asignar', value: target.unassigned },
    { label: 'Porcentaje de asignación', value: `${percentages.assigned.toFixed(1)}%` },
    { label: 'Porcentaje sin asignar', value: `${percentages.unassigned.toFixed(1)}%` },
  ] : [
    { label: 'Total de eventos', value: target.total },
    { label: 'Recursos asignados', value: target.assigned },
    { label: 'Recursos sin asignar', value: target.unassigned },
    { label: 'Porcentaje de asignación', value: `${percentages.assigned.toFixed(1)}%` },
    { label: 'Porcentaje sin asignar', value: `${percentages.unassigned.toFixed(1)}%` },
  ]
  const choosePeriod = (event) => { setAnalysisId(event.target.value); setOperatorName(''); setZoneName('') }
  const chooseOperator = (event) => { setOperatorName(event.target.value); setZoneName('') }
  const chooseZone = (event) => { setZoneName(event.target.value); setOperatorName('') }

  return <section className="assignment-analysis" aria-label="Asignación por operador y zona">
    <div className="summary-heading"><div><p className="eyebrow">Asignación de recursos</p><h2>Asignación por operador y zona</h2><p>Las celdas sin tiempo de despacho-arribo se contabilizan como recursos sin asignar.</p></div></div>
    <label className="assignment-period-picker">Franja de análisis<select value={analysisId} onChange={choosePeriod}>{assignmentAnalyses.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
    <div className="assignment-controls"><label>Ver por operador<select value={operatorName} onChange={chooseOperator}><option value="">Seleccionar operador</option>{analysis.operators.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label><span>o</span><label>Ver por zona<select value={zoneName} onChange={chooseZone}><option value="">Seleccionar zona</option>{analysis.zones.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label></div>
    {target ? <article className="assignment-detail"><header><div><p className="eyebrow">{kind === 'operator' ? 'Operador seleccionado' : 'Zona seleccionada'}</p><h3>{target.name}</h3>{zone && <p className="assignment-quadrants">Área: {zone.area} · {zone.neighborhoods} barrios incluidos</p>}</div><button className="primary" onClick={() => downloadAssignmentAnalysisPdf({ kind, name: target.name, period: analysis.period, stats: target, area: zone?.area, neighborhoods: zone?.neighborhoods, allZoneTotal: analysis.totalZoneEvents })}><Download size={16} /> Descargar PDF</button></header><dl>{metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{typeof metric.value === 'number' ? format.format(metric.value) : metric.value}</dd></div>)}</dl>{zone && analysis.recordsWithoutZone > 0 && <p className="assignment-note">{analysis.recordsWithoutZone} registros sin cuadrícula no se incluyen en el total por zona.</p>}</article> : <p className="summary-empty">Seleccione un operador o una zona para ver el detalle de asignación.</p>}
  </section>
}
*/

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
  const byWeek = Object.entries(records.reduce((groups, record) => { (groups[record.week] ||= []).push(record); return groups }, {})).map(([week, items]) => ({ week, cumplimiento: Number(totalsOf(items).compliance.toFixed(1)), order: items.reduce((earliest, item) => item.sortDate < earliest ? item.sortDate : earliest, items[0].sortDate) })).sort((a, b) => a.order.localeCompare(b.order))
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
  const [view, setView] = useState('two-day-reports')
  const [pdfRequest, setPdfRequest] = useState(null)
  const [pdfObservation, setPdfObservation] = useState('')
  useEffect(() => { fetch('/auditoria-2026.xlsx', { cache: 'no-store' }).then((response) => response.ok ? response.arrayBuffer() : Promise.reject()).then((buffer) => setRecords(parseWorkbook(buffer).records)).catch(() => {}) }, [])
  const availableRecords = useMemo(() => excludeReplacedDailyRecords(records), [records])
  const latestWeek = useMemo(() => availableRecords.filter((record) => /^\d{4}-\d{2}-\d{2}$/.test(record.sortDate)).reduce((latest, record) => !latest || record.sortDate > latest.sortDate ? record : latest, null)?.week || 'Sin datos cargados', [availableRecords])
  const periodRecords = useMemo(() => availableRecords.filter((record) => (filters.month === 'Todos' || record.month === filters.month) && (filters.week === 'Todas' || record.week === filters.week)).sort((a, b) => b.sortDate.localeCompare(a.sortDate) || a.shift.localeCompare(b.shift)), [availableRecords, filters.month, filters.week])
  const filtered = useMemo(() => periodRecords.filter((record) => filters.auditor === 'Todos' || record.auditorList.includes(filters.auditor)), [periodRecords, filters.auditor])
  const requestPdf = (shift, shiftRecords) => { setPdfObservation(''); setPdfRequest({ shift, records: shiftRecords }) }
  const generatePdf = () => { if (!pdfRequest) return; downloadShiftPdf(pdfRequest.shift, pdfRequest.records, TURN_COLORS[pdfRequest.shift], periodRecords, pdfObservation); setPdfRequest(null); setPdfObservation('') }
  return <><Header active="dashboard" /><main className="app-shell"><section className="intro"><div><p className="eyebrow">Última semana cargada · {latestWeek}</p><h1>Auditoría de móviles</h1><p>Seguimiento de alertas y cumplimiento por turno.</p></div></section><Filters records={availableRecords} filters={filters} setFilters={setFilters} view={view} setView={setView} />{view === 'two-day-reports' ? <TwoDayResourceReports /> : view === 'incident-follow-up' ? <FollowUpReports /> : <><ShiftBlocks records={filtered} onRequestPdf={requestPdf} /><Charts records={filtered} /></>}</main><PdfModal request={pdfRequest} observation={pdfObservation} onObservationChange={setPdfObservation} onCancel={() => { setPdfRequest(null); setPdfObservation('') }} onGenerate={generatePdf} /></>
}

function Header() { return <header className="topbar"><a className="brand" href="/"><span className="brand-mark"><BarChart3 size={19} /></span><span>Auditoría <b>2026</b></span></a></header> }
