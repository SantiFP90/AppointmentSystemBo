import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

import { toSignal } from '@angular/core/rxjs-interop';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Store } from '@ngrx/store';
import { loadCalendar } from '../../../main/store/calendar/actions-calendar';
import { selectCalendar } from '../../../main/store/calendar/selectors-calendar';

import { Appointment } from '../../../main/Interfaces/appoiment.interface';
import {
  CalendarDay,
  CalendarTimeSlot,
} from '../../../main/Interfaces/calendar-appoiments.interface';
import { TimeSlot } from '../../../main/Interfaces/time-slot.interface';
import { TimeSlotService } from '../../../main/services/time-slot.service';
import { createAppointment } from '../../../main/store/appoiments/actions-appoiment';

@Component({
  selector: 'app-app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    ToastModule,
    DropdownModule,
    DialogModule,
    ProgressBarModule,
  ],
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.scss'],
  providers: [MessageService],
})
export class AppCalendarComponent implements OnInit {
  appointmentForm: FormGroup;
  events: any[] = [];
  selectedAppointment: any = null;
  viewTurn: boolean = false;
  private pendingPreselectSlot: { startTime: string; endTime: string } | null =
    null;
  displayDialog: boolean = false;

  // Signal del store
  calendarData = toSignal(this.store.select(selectCalendar), {
    initialValue: [],
  });

  timeSlots = signal<TimeSlot[]>([]);

  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    aspectRatio: 3,
    height: 600,
    contentHeight: 580,
    expandRows: false,
    dayMaxEventRows: 2,
    dayMaxEvents: 2,
    moreLinkClick: 'day',
    moreLinkText: (n) => `+${n} más`,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    events: this.events,
    editable: false,
    selectable: true,
    selectMirror: true,
    allDaySlot: false,
    hiddenDays: [0],
    fixedWeekCount: false,
    showNonCurrentDates: false,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    datesSet: this.handleDatesSet.bind(this),
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: Store,
    private timeSlotService: TimeSlotService
  ) {
    this.appointmentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+$/),
          Validators.minLength(2),
        ],
      ],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{7,10}$/)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      clientEmail: ['', [Validators.email]],
      clientPhoneNumber: ['', [Validators.pattern(/^[0-9+\s-]{7,20}$/)]],
      amount: [{ value: 10000, disabled: true }],
      description: ['', [Validators.maxLength(500)]],
    });

    effect(() => {
      const calendarDays: CalendarDay[] = this.calendarData();
      if (!calendarDays || calendarDays.length === 0) return;

      const slotEvents = calendarDays.flatMap((day) =>
        day.timeSlots.map((slot: CalendarTimeSlot) => {
          const start = new Date(day.date);

          const end = new Date(day.date);

          const [startHour, startMinute] = slot.startTime
            .split(':')
            .map(Number);
          start.setHours(startHour, startMinute, 0, 0);

          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          end.setHours(endHour, endMinute, 0, 0);

          return {
            title: slot.isAvailable
              ? 'Disponible'
              : `Ocupado: ${slot.appointment?.clientName}`,
            start: start,
            end: end,
            backgroundColor: slot.isAvailable ? '#4CAF50' : '#FF6B6B',
            borderColor: slot.isAvailable ? '#4CAF50' : '#FF6B6B',
            textColor: '#fff',
            extendedProps: {
              ...slot,
              workingDayId: day.workingDayId,
            },
          };
        })
      );

      const backgroundEvents = calendarDays.map((day) => ({
        title: '',
        start: day.date,
        display: 'background',
        extendedProps: {
          workingDayId: day.workingDayId,
        },
      }));

      this.events = [...slotEvents, ...backgroundEvents];

      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      };
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.loadCalendar(today.getMonth() + 1, today.getFullYear());
  }

  loadCalendar(month: number, year: number) {
    this.store.dispatch(loadCalendar({ month, year }));
  }

  private loadTimeSlots(workingDayId: string) {
    this.timeSlotService.getTimeSlots(workingDayId).subscribe((response) => {
      if (response.success) {
        const timeSlotsWithRange = response.data.map((slot: TimeSlot) => ({
          ...slot,
          timeRange: `${slot.startTime} - ${slot.endTime}`,
        }));

        this.timeSlots.set(timeSlotsWithRange);

        if (this.pendingPreselectSlot) {
          const match = timeSlotsWithRange.find(
            (s: TimeSlot) =>
              s.startTime === this.pendingPreselectSlot!.startTime &&
              s.endTime === this.pendingPreselectSlot!.endTime
          );
          if (match) this.appointmentForm.patchValue({ time: match.id });
          this.pendingPreselectSlot = null;
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      }
    });
  }

  handleDateClick(arg: any) {
    const calendarApi = arg.view.calendar;
    const eventsForDay = calendarApi
      .getEvents()
      .filter((event: any) => event.startStr.startsWith(arg.dateStr));

    const backgroundEvent = eventsForDay.find(
      (e: any) => e.display === 'background' && e.extendedProps?.workingDayId
    );

    if (backgroundEvent) {
      const workingDayId = backgroundEvent.extendedProps.workingDayId;
      this.appointmentForm.patchValue({
        date: new Date(arg.dateStr),
        time: null,
      });
      this.loadTimeSlots(workingDayId);
      this.openRegisterModal();
    }
  }

  handleEventClick(arg: any) {
    const event = arg.event;
    const eventDate = new Date(event.start);
    const isAvailable = !!event.extendedProps?.isAvailable;
    const hasAppointment = !!event.extendedProps?.appointment;

    if (isAvailable && !hasAppointment) {
      this.viewTurn = false;
      this.appointmentForm.patchValue({ date: eventDate });
      const workingDayId = event.extendedProps?.workingDayId;
      const startTime: string = event.extendedProps?.startTime;
      const endTime: string = event.extendedProps?.endTime;
      this.pendingPreselectSlot = { startTime, endTime };
      const evtSlotId: number | undefined = event.extendedProps?.timeSlotId;
      if (workingDayId) this.loadTimeSlots(workingDayId);
      this.openRegisterModal();
    } else {
      this.selectedAppointment = {
        name: event._def.title,
        date: eventDate,
        time: eventDate,
        description: event.extendedProps.description || '',
      };
      this.viewTurn = true;
    }
  }

  handleDatesSet(arg: any) {
    const currentStart: Date = arg.view.currentStart;
    const month = currentStart.getMonth() + 1;
    const year = currentStart.getFullYear();
    this.loadCalendar(month, year);
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const eventDate = new Date(formValue.date);

      const selectedSlotId =
        typeof formValue.time === 'string'
          ? parseInt(formValue.time, 10)
          : formValue.time;
      const selectedSlot = this.timeSlots().find(
        (slot) => slot.id === selectedSlotId
      );

      if (!selectedSlot) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se encontró el horario seleccionado.',
        });
        return;
      }

      const [startHours, startMinutes] = selectedSlot.startTime
        .split(':')
        .map(Number);
      const [endHours, endMinutes] = selectedSlot.endTime
        .split(':')
        .map(Number);

      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const payload: Appointment = {
        clientId: 0,
        timeSlotId: selectedSlotId,
        clientName: formValue.name,
        clientEmail: formValue.clientEmail || null,
        clientPhoneNumber: formValue.clientPhoneNumber || null,
        notes: formValue.description ?? null,
        amount: 10000,
      };

      this.store.dispatch(
        createAppointment({ payload, selectedDate: eventDate.toISOString() })
      );

      this.closeRegisterModal();

      this.messageService.add({
        severity: 'success',
        summary: 'Turno Registrado',
        detail: `Se registró el turno para ${formValue.name}`,
      });
    }
  }

  openRegisterModal() {
    this.displayDialog = true;
  }

  closeRegisterModal() {
    this.displayDialog = false;
    this.appointmentForm.reset();
  }

  getFormProgress(): number {
    const controls = this.appointmentForm.controls;
    let filled = 0;
    const total = 5;
    if (controls['name'].value) filled++;
    if (controls['dni'].value) filled++;
    if (controls['date'].value) filled++;
    if (controls['time'].value) filled++;
    if (controls['clientEmail'].value) filled++;
    if (controls['clientPhoneNumber'].value) filled++;
    return Math.round((filled / total) * 100);
  }

  getSelectedTimeLabel(): string {
    const control = this.appointmentForm.get('time');
    const selectedId: number | null = control ? control.value : null;
    if (selectedId == null) return '';
    const slot = this.timeSlots().find((s: TimeSlot) => s.id === selectedId);
    return slot ? slot.timeRange ?? `${slot.startTime} - ${slot.endTime}` : '';
  }

  getSelectedIsAvailable(): boolean {
    const control = this.appointmentForm.get('time');
    const selectedId: number | null = control ? control.value : null;
    if (selectedId == null) return false;
    const slot = this.timeSlots().find((s: TimeSlot) => s.id === selectedId);
    return slot ? !!slot.isAvailable : false;
  }
}
