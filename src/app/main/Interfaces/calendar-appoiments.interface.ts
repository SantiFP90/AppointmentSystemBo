export interface CalendarDay {
  date: string;
  timeSlots: CalendarTimeSlot[];
}

export interface CalendarTimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointment: AppointmentCalendar | null;
}

export interface AppointmentCalendar {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string | null;
  notes: string | null;
  status: number;
  paymentStatus: number;
  amount: number | null;
  createdAt: string;
  timeSlotId: number;
}
