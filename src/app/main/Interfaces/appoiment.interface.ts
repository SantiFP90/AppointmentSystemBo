export interface Appointment {
  clientId: number;
  timeSlotId: number;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhoneNumber?: string | null;
  status?: number;
  notes?: string | null;
  amount?: number | null;
}
