// Histórico manual de informes de recursos por franja de dos días.
export const twoDayResourceReports = [
  {
    id: '2026-11-02_2026-11-03',
    label: '02/11 – 03/11',
    startDate: '2026-11-02',
    endDate: '2026-11-03',
    shifts: [
      { shift: 'A', totalEvents: 5, assignedResources: 3, unassignedResources: 2 },
      { shift: 'B', totalEvents: 200, assignedResources: 148, unassignedResources: 52 },
      { shift: 'C', totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      { shift: 'D', totalEvents: 358, assignedResources: 177, unassignedResources: 181 },
      { shift: 'E', totalEvents: 108, assignedResources: 77, unassignedResources: 31 },
      { shift: 'F', totalEvents: 132, assignedResources: 64, unassignedResources: 68 },
    ],
    zoneBreakdown: {
      A: {
        Norte: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        Sur: { totalEvents: 5, assignedResources: 3, unassignedResources: 2 },
        Este: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        'Centro/Oeste': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      B: {
        Norte: { totalEvents: 37, assignedResources: 20, unassignedResources: 17 },
        Sur: { totalEvents: 33, assignedResources: 25, unassignedResources: 8 },
        Este: { totalEvents: 73, assignedResources: 60, unassignedResources: 13 },
        'Centro/Oeste': { totalEvents: 44, assignedResources: 38, unassignedResources: 6 },
      },
      C: {
        Norte: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        Sur: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        Este: { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
        'Centro/Oeste': { totalEvents: 0, assignedResources: 0, unassignedResources: 0 },
      },
      D: {
        Norte: { totalEvents: 62, assignedResources: 32, unassignedResources: 30 },
        Sur: { totalEvents: 63, assignedResources: 33, unassignedResources: 30 },
        Este: { totalEvents: 116, assignedResources: 54, unassignedResources: 62 },
        'Centro/Oeste': { totalEvents: 91, assignedResources: 53, unassignedResources: 38 },
      },
      E: {
        Norte: { totalEvents: 23, assignedResources: 10, unassignedResources: 13 },
        Sur: { totalEvents: 21, assignedResources: 19, unassignedResources: 2 },
        Este: { totalEvents: 40, assignedResources: 31, unassignedResources: 9 },
        'Centro/Oeste': { totalEvents: 20, assignedResources: 15, unassignedResources: 5 },
      },
      F: {
        Norte: { totalEvents: 7, assignedResources: 3, unassignedResources: 4 },
        Sur: { totalEvents: 25, assignedResources: 9, unassignedResources: 16 },
        Este: { totalEvents: 56, assignedResources: 21, unassignedResources: 35 },
        'Centro/Oeste': { totalEvents: 35, assignedResources: 30, unassignedResources: 5 },
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
