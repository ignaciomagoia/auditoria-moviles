// Los períodos se publican solo cuando sus datos están completos y validados.
const stats = (totalEvents = 0, correctlyAssignedResources = 0, incorrectlyAssignedResources = 0, unassignedResources = 0) => ({
  totalEvents,
  correctlyAssignedResources,
  incorrectlyAssignedResources,
  unassignedResources,
})

const zoneNames = ['Norte 1', 'Norte 2', 'Este 1', 'Este 2', 'Sur 1', 'Sur 2', 'Centro', 'Oeste', 'Fuera de cuadrante', 'Distrito sin asociar']
const zones = (entries = {}) => Object.fromEntries(zoneNames.map((name) => [name, entries[name] ?? stats()]))

export const twoDayResourceReports = [
  {
    id: '2026-11-16_2026-11-17',
    label: '16/11 – 17/11',
    startDate: '2026-11-16',
    endDate: '2026-11-17',
    zoneNames,
    zoneSectionTitle: 'MÓVILES SIN ASIGNAR POR FRECUENCIA',
    shifts: [
      { shift: 'A', ...stats(174, 122, 49, 3) },
      { shift: 'B', ...stats() },
      { shift: 'C', ...stats(300, 206, 87, 7) },
      { shift: 'D', ...stats() },
      { shift: 'E', ...stats(89, 60, 25, 4) },
      { shift: 'F', ...stats(107, 71, 23, 13) },
    ],
    zoneBreakdown: {
      A: zones({
        'Norte 1': stats(15, 14, 1, 0), 'Norte 2': stats(1, 1, 0, 0), 'Este 1': stats(36, 28, 8, 0), 'Este 2': stats(19, 13, 6, 0),
        'Sur 1': stats(20, 14, 6, 0), 'Sur 2': stats(7, 4, 3, 0), Centro: stats(23, 16, 7, 0), Oeste: stats(29, 18, 11, 0),
        'Fuera de cuadrante': stats(10, 3, 4, 3), 'Distrito sin asociar': stats(14, 11, 3, 0),
      }),
      B: zones(),
      C: zones({
        'Norte 1': stats(33, 25, 7, 1), 'Norte 2': stats(4, 1, 3, 0), 'Este 1': stats(50, 39, 10, 1), 'Este 2': stats(40, 31, 9, 0),
        'Sur 1': stats(37, 22, 15, 0), 'Sur 2': stats(22, 19, 3, 0), Centro: stats(33, 25, 8, 0), Oeste: stats(40, 25, 15, 0),
        'Fuera de cuadrante': stats(14, 6, 5, 3), 'Distrito sin asociar': stats(27, 13, 12, 2),
      }),
      D: zones(),
      E: zones({
        'Norte 1': stats(6, 6, 0, 0), 'Este 1': stats(23, 16, 7, 0), 'Este 2': stats(6, 3, 3, 0), 'Sur 1': stats(8, 8, 0, 0),
        'Sur 2': stats(9, 8, 1, 0), Centro: stats(13, 6, 7, 0), Oeste: stats(12, 12, 0, 0),
        'Fuera de cuadrante': stats(4, 0, 2, 2), 'Distrito sin asociar': stats(8, 1, 5, 2),
      }),
      F: zones({
        'Norte 1': stats(12, 9, 3, 0), 'Norte 2': stats(2, 1, 1, 0), 'Este 1': stats(33, 21, 10, 2), 'Este 2': stats(16, 13, 2, 1),
        'Sur 1': stats(19, 12, 2, 5), 'Sur 2': stats(3, 2, 0, 1), Centro: stats(12, 7, 3, 2), Oeste: stats(2, 1, 1, 0),
        'Fuera de cuadrante': stats(3, 3, 0, 0), 'Distrito sin asociar': stats(5, 2, 1, 2),
      }),
    },
    zoneBreakdownNote: 'Los eventos sin cuadrante se contabilizan como fuera de cuadrante.',
  },
  {
    id: '2026-11-14_2026-11-15',
    label: '14/11 – 15/11',
    startDate: '2026-11-14',
    endDate: '2026-11-15',
    zoneNames,
    zoneSectionTitle: 'MÓVILES SIN ASIGNAR POR FRECUENCIA',
    shifts: [
      { shift: 'A', ...stats() },
      { shift: 'B', ...stats(225, 159, 45, 21) },
      { shift: 'C', ...stats() },
      { shift: 'D', ...stats(411, 277, 121, 13) },
      { shift: 'E', ...stats(137, 104, 28, 5) },
      { shift: 'F', ...stats(344, 173, 112, 59) },
    ],
    zoneBreakdown: {
      A: zones(),
      B: zones({
        'Norte 1': stats(18, 14, 4, 0), 'Norte 2': stats(1, 1, 0, 0), 'Este 1': stats(49, 34, 13, 2), 'Este 2': stats(38, 34, 2, 2),
        'Sur 1': stats(19, 17, 1, 1), 'Sur 2': stats(9, 5, 4, 0), Centro: stats(27, 17, 6, 4), Oeste: stats(25, 19, 5, 1),
        'Fuera de cuadrante': stats(19, 4, 5, 10), 'Distrito sin asociar': stats(20, 14, 5, 1),
      }),
      C: zones(),
      D: zones({
        'Norte 1': stats(48, 36, 11, 1), 'Norte 2': stats(2, 1, 1, 0), 'Este 1': stats(102, 63, 33, 6), 'Este 2': stats(69, 52, 17, 0),
        'Sur 1': stats(35, 25, 9, 1), 'Sur 2': stats(18, 2, 15, 1), Centro: stats(39, 28, 10, 1), Oeste: stats(45, 35, 9, 1),
        'Fuera de cuadrante': stats(16, 7, 7, 2), 'Distrito sin asociar': stats(37, 28, 9, 0),
      }),
      E: zones({
        'Norte 1': stats(11, 8, 3, 0), 'Este 1': stats(35, 24, 10, 1), 'Este 2': stats(20, 13, 7, 0), 'Sur 1': stats(16, 15, 1, 0),
        'Sur 2': stats(7, 6, 1, 0), Centro: stats(11, 10, 1, 0), Oeste: stats(20, 19, 1, 0),
        'Fuera de cuadrante': stats(8, 3, 2, 3), 'Distrito sin asociar': stats(9, 6, 2, 1),
      }),
      F: zones({
        'Norte 1': stats(29, 18, 6, 5), 'Norte 2': stats(2, 2, 0, 0), 'Este 1': stats(79, 42, 31, 6), 'Este 2': stats(52, 19, 30, 3),
        'Sur 1': stats(41, 16, 5, 20), 'Sur 2': stats(17, 10, 4, 3), Centro: stats(35, 19, 9, 7), Oeste: stats(55, 31, 17, 7),
        'Fuera de cuadrante': stats(12, 2, 3, 7), 'Distrito sin asociar': stats(22, 14, 7, 1),
      }),
    },
    zoneBreakdownNote: 'Los eventos sin cuadrante se contabilizan como fuera de cuadrante.',
  },
]

/* Archivo temporal de períodos anteriores, sin publicar en la aplicación.
  {
    id: '2026-11-02_2026-11-03',
    label: '02/11 – 03/11',
    startDate: '2026-11-02',
    endDate: '2026-11-03',
    zoneNames: ['Norte 1', 'Norte 2', 'Este 1', 'Este 2', 'Sur 1', 'Sur 2', 'Centro', 'Oeste', 'Fuera de cuadrante', 'Distrito sin asociar'],
    zoneSectionTitle: 'MÓVILES SIN ASIGNAR POR FRECUENCIA',
    shifts: [
      { shift: 'A', totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      { shift: 'B', totalEvents: 207, assignedResources: 152, unassignedResources: 55 },
      { shift: 'C', totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      { shift: 'D', totalEvents: 357, assignedResources: 174, unassignedResources: 183 },
      { shift: 'E', totalEvents: 88, assignedResources: 66, unassignedResources: 22 },
      { shift: 'F', totalEvents: 150, assignedResources: 78, unassignedResources: 72 },
    ],
    zoneBreakdown: {
      B: {
        'Norte 1': { totalEvents: 25, assignedResources: 13, unassignedResources: 12 },
        'Norte 2': { totalEvents: 13, assignedResources: 8, unassignedResources: 5 },
        'Este 1': { totalEvents: 47, assignedResources: 37, unassignedResources: 10 },
        'Este 2': { totalEvents: 29, assignedResources: 25, unassignedResources: 4 },
        'Sur 1': { totalEvents: 21, assignedResources: 18, unassignedResources: 3 },
        'Sur 2': { totalEvents: 11, assignedResources: 6, unassignedResources: 5 },
        Centro: { totalEvents: 23, assignedResources: 22, unassignedResources: 1 },
        Oeste: { totalEvents: 27, assignedResources: 19, unassignedResources: 8 },
        'Fuera de cuadrante': { totalEvents: 11, assignedResources: 4, unassignedResources: 7 },
        'Distrito sin asociar': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      D: {
        'Norte 1': { totalEvents: 43, assignedResources: 20, unassignedResources: 23 },
        'Norte 2': { totalEvents: 18, assignedResources: 10, unassignedResources: 8 },
        'Este 1': { totalEvents: 76, assignedResources: 35, unassignedResources: 41 },
        'Este 2': { totalEvents: 44, assignedResources: 19, unassignedResources: 25 },
        'Sur 1': { totalEvents: 38, assignedResources: 17, unassignedResources: 21 },
        'Sur 2': { totalEvents: 25, assignedResources: 15, unassignedResources: 10 },
        Centro: { totalEvents: 45, assignedResources: 26, unassignedResources: 19 },
        Oeste: { totalEvents: 43, assignedResources: 27, unassignedResources: 16 },
        'Fuera de cuadrante': { totalEvents: 25, assignedResources: 5, unassignedResources: 20 },
        'Distrito sin asociar': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      E: {
        'Norte 1': { totalEvents: 7, assignedResources: 3, unassignedResources: 4 },
        'Norte 2': { totalEvents: 3, assignedResources: 1, unassignedResources: 2 },
        'Este 1': { totalEvents: 24, assignedResources: 19, unassignedResources: 5 },
        'Este 2': { totalEvents: 14, assignedResources: 12, unassignedResources: 2 },
        'Sur 1': { totalEvents: 13, assignedResources: 11, unassignedResources: 2 },
        'Sur 2': { totalEvents: 8, assignedResources: 8, unassignedResources: 0 },
        Centro: { totalEvents: 10, assignedResources: 6, unassignedResources: 4 },
        Oeste: { totalEvents: 7, assignedResources: 5, unassignedResources: 2 },
        'Fuera de cuadrante': { totalEvents: 2, assignedResources: 1, unassignedResources: 1 },
        'Distrito sin asociar': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      F: {
        'Norte 1': { totalEvents: 12, assignedResources: 6, unassignedResources: 6 },
        'Norte 2': { totalEvents: 9, assignedResources: 5, unassignedResources: 4 },
        'Este 1': { totalEvents: 33, assignedResources: 13, unassignedResources: 20 },
        'Este 2': { totalEvents: 18, assignedResources: 6, unassignedResources: 12 },
        'Sur 1': { totalEvents: 25, assignedResources: 10, unassignedResources: 15 },
        'Sur 2': { totalEvents: 6, assignedResources: 5, unassignedResources: 1 },
        Centro: { totalEvents: 17, assignedResources: 14, unassignedResources: 3 },
        Oeste: { totalEvents: 19, assignedResources: 17, unassignedResources: 2 },
        'Fuera de cuadrante': { totalEvents: 11, assignedResources: 2, unassignedResources: 9 },
        'Distrito sin asociar': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
    },
    zoneBreakdownNote: 'Los eventos sin cuadrícula se contabilizan como fuera de cuadrante.',
  },
  {
    id: '2026-10-25_2026-10-26',
    label: '25/10 – 26/10',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    shifts: [
      { shift: 'A', totalEvents: 12, assignedResources: 0, unassignedResources: 12 },
      { shift: 'B', totalEvents: 179, assignedResources: 132, unassignedResources: 47 },
      { shift: 'C', totalEvents: 18, assignedResources: 3, unassignedResources: 15 },
      { shift: 'D', totalEvents: 285, assignedResources: 54, unassignedResources: 231 },
      { shift: 'E', totalEvents: 152, assignedResources: 77, unassignedResources: 75 },
      { shift: 'F', totalEvents: 108, assignedResources: 15, unassignedResources: 93 },
    ],
    zoneBreakdown: {
      A: {
        Norte: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        Sur: { totalEvents: 10, assignedResources: 0, unassignedResources: 10 },
        Este: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        'Centro/Oeste': { totalEvents: 1, assignedResources: 0, unassignedResources: 1 },
      },
      B: {
        Norte: { totalEvents: 31, assignedResources: 23, unassignedResources: 8 },
        Sur: { totalEvents: 30, assignedResources: 28, unassignedResources: 2 },
        Este: { totalEvents: 65, assignedResources: 53, unassignedResources: 12 },
        'Centro/Oeste': { totalEvents: 42, assignedResources: 26, unassignedResources: 16 },
      },
      C: {
        Norte: { totalEvents: 6, assignedResources: 0, unassignedResources: 6 },
        Sur: { totalEvents: 11, assignedResources: 3, unassignedResources: 8 },
        Este: { totalEvents: 1, assignedResources: 0, unassignedResources: 1 },
        'Centro/Oeste': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      D: {
        Norte: { totalEvents: 40, assignedResources: 2, unassignedResources: 38 },
        Sur: { totalEvents: 38, assignedResources: 19, unassignedResources: 19 },
        Este: { totalEvents: 114, assignedResources: 26, unassignedResources: 88 },
        'Centro/Oeste': { totalEvents: 79, assignedResources: 7, unassignedResources: 72 },
      },
      E: {
        Norte: { totalEvents: 18, assignedResources: 11, unassignedResources: 7 },
        Sur: { totalEvents: 27, assignedResources: 21, unassignedResources: 6 },
        Este: { totalEvents: 63, assignedResources: 32, unassignedResources: 31 },
        'Centro/Oeste': { totalEvents: 37, assignedResources: 12, unassignedResources: 25 },
      },
      F: {
        Norte: { totalEvents: 19, assignedResources: 4, unassignedResources: 15 },
        Sur: { totalEvents: 14, assignedResources: 0, unassignedResources: 14 },
        Este: { totalEvents: 40, assignedResources: 6, unassignedResources: 34 },
        'Centro/Oeste': { totalEvents: 24, assignedResources: 5, unassignedResources: 19 },
      },
    },
    zoneBreakdownNote: 'El desglose por zona se asocia a cada turno seg\u00fan la n\u00f3mina. Los eventos sin cuadr\u00edcula no se atribuyen a una zona.',
  },
  {
    id: '2026-10-27_2026-10-28',
    label: '27/10 – 28/10',
    startDate: '2026-10-27',
    endDate: '2026-10-28',
    shifts: [
      { shift: 'A', totalEvents: 246, assignedResources: 178, unassignedResources: 68 },
      { shift: 'C', totalEvents: 341, assignedResources: 234, unassignedResources: 107 },
    ],
  },
  {
    id: '2026-10-25_2026-10-28',
    label: '25/10 – 28/10',
    startDate: '2026-10-25',
    endDate: '2026-10-28',
    shifts: [
      { shift: 'E', totalEvents: 281, assignedResources: 162, unassignedResources: 119 },
      { shift: 'F', totalEvents: 179, assignedResources: 69, unassignedResources: 110 },
    ],
  },
]
*/
