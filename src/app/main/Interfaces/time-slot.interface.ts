export interface TimeSlot {
  workingDayId: number;
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  timeRange?: string;
}
