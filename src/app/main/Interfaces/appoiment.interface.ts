export interface Appointment {
  clientId: number;
  timeSlotId: number;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhoneNumber?: string | null;
  notes?: string | null;
  amount?: number | null;
}
