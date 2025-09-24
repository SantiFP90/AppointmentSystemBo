export enum AppointmentStatus {
  Scheduled = 1,
  Confirmed = 2,
  InProgress = 3,
  Completed = 4,
  NoShow = 5,
  Cancelled = 6,
}

export const AppointmentStatusEs: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Scheduled]: 'Programado',
  [AppointmentStatus.Confirmed]: 'Confirmado',
  [AppointmentStatus.InProgress]: 'En curso',
  [AppointmentStatus.Completed]: 'Completado',
  [AppointmentStatus.NoShow]: 'No asistió',
  [AppointmentStatus.Cancelled]: 'Cancelado',
};
