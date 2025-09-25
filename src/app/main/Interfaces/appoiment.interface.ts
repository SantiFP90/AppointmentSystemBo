export interface Appointment {
  id?: number;
  clientId: number;
  timeSlotId: number;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhoneNumber?: string | null;
  status?: number;
  notes?: string | null;
  amount?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  workingDayDate?: string | null;
}
