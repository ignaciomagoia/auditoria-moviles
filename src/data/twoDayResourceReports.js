// Histórico manual de informes de recursos por franja de dos días.
export const twoDayResourceReports = [
  {
    id: '2026-10-25_2026-10-26',
    label: '25/10 – 26/10',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    shifts: [
      { shift: 'B', totalEvents: 178, assignedResources: 130, unassignedResources: 40 },
      { shift: 'D', totalEvents: 307, assignedResources: 55, unassignedResources: 252 },
    ],
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
