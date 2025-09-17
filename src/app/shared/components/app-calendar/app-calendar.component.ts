import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

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
  ],
  templateUrl: './app-calendar.component.html',
  styleUrl: './app-calendar.component.scss',
  providers: [MessageService],
})
export class AppCalendarComponent implements OnInit {
  appointmentForm: FormGroup;

  workingDays: any[] = [];

  events: any[] = [];

  timeOptions = [
    { label: '09:00 AM', value: '09:00' },
    { label: '09:30 AM', value: '09:30' },
    { label: '10:00 AM', value: '10:00' },
    { label: '10:30 AM', value: '10:30' },
    { label: '11:00 AM', value: '11:00' },
    { label: '11:30 AM', value: '11:30' },
    { label: '12:00 PM', value: '12:00' },
    { label: '12:30 PM', value: '12:30' },
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '02:30 PM', value: '14:30' },
    { label: '03:00 PM', value: '15:00' },
    { label: '03:30 PM', value: '15:30' },
    { label: '04:00 PM', value: '16:00' },
    { label: '04:30 PM', value: '16:30' },
    { label: '05:00 PM', value: '17:00' },
    { label: '05:30 PM', value: '17:30' },
    { label: '06:00 PM', value: '18:00' },
  ];

  holidays = ['2025-01-01', '2025-02-12', '2025-02-13', '2025-03-24'];

  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
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
    dayMaxEvents: true,
    allDaySlot: false,
    hiddenDays: [0],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  selectedAppointment: any = null;
  viewTurn: boolean = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      dni: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    
  }

  handleDateClick(arg: any) {
    const clickedDate = new Date(arg.date);
    console.log(clickedDate);
    if (this.disableWeekendsAndHolidays(clickedDate)) {
      this.appointmentForm.patchValue({
        date: clickedDate,
      });
      this.viewTurn = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'El día seleccionado no está disponible',
        detail: `Intente con otra fecha!`,
      });
    }
  }

  handleEventClick(arg: any) {
    const event = arg.event;
    const eventDate = new Date(event.start);
    this.selectedAppointment = {
      name: event._def.title,
      date: eventDate,
      time: eventDate,
      description: event.extendedProps.description || '',
    };
    this.viewTurn = true;
  }

  disableWeekendsAndHolidays(selectInfo: any): boolean {
    let selectedDate: string;
    try {
      const date = new Date(selectInfo);
      if (isNaN(date.getTime())) {
        return false;
      }
      selectedDate = date.toISOString().split('T')[0];
    } catch (error) {
      return false;
    }
    if (this.holidays.includes(selectedDate)) {
      return false;
    }
    return true;
  }

  formatDateTime(date: Date, time: Date | string): string {
    if (!date || !time) return '';
    let hours: any;
    let minutes: any;
    const formattedDate = new Date(date);
    if (typeof time === 'string') {
      hours = time;
      formattedDate.setHours(parseInt(hours.split(':')[0]));
      formattedDate.setMinutes(parseInt(hours.split(':')[1]));
    } else {
      hours = time.getHours();
      minutes = time.getMinutes();
      formattedDate.setHours(hours);
      formattedDate.setMinutes(minutes);
    }
    return formattedDate.toISOString();
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const eventDateTime = this.formatDateTime(formValue.date, formValue.time);
      const newEvent = {
        title: formValue.name + ' - ' + formValue.dni,
        start: eventDateTime,
        description: formValue.description,
      };
      this.events = [...this.events, newEvent];
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      };
      this.appointmentForm.reset();
      this.messageService.add({
        severity: 'success',
        summary: 'Turno Registrado',
        detail: `Se registró el turno para ${formValue.name}`,
      });
    }
  }
}
