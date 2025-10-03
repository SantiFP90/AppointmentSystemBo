import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, OnDestroy, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';

import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { loadCalendar } from '../../../main/store/calendar/actions-calendar';
import { selectCalendar } from '../../../main/store/calendar/selectors-calendar';

import { Appointment } from '../../../main/Interfaces/appoiment.interface';
import { CalendarDay } from '../../../main/Interfaces/calendar-appoiments.interface';
import { TimeSlot } from '../../../main/Interfaces/time-slot.interface';
import { TimeSlotService } from '../../../main/services/time-slot.service';
import { createAppointment } from '../../../main/store/appoiments/actions-appoiment';
import { ClientRegisterService } from '../../../shared/services/client-register.service';

interface BookingStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

@Component({
  selector: 'app-client-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ProgressBarModule,
    ToastModule,
    DividerModule,
    RippleModule,
    SkeletonModule,
    FormsModule,
  ],
  templateUrl: './client-booking.component.html',
  styleUrls: ['./client-booking.component.scss'],
})
export class ClientBookingComponent implements OnInit, OnDestroy {
  bookingForm: FormGroup;
  currentStep = signal(1);
  selectedDate = signal<Date | null>(null);
  selectedSlot = signal<TimeSlot | null>(null);
  isLoading = signal(false);
  showConfirmation = signal(false);

  // Subscription management
  private subscriptions = new Subscription();

  // Calendar data
  calendarData = toSignal(this.store.select(selectCalendar), {
    initialValue: [],
  });
  availableDates = signal<Date[]>([]);
  timeSlots = signal<TimeSlot[]>([]);

  // Steps configuration
  steps: BookingStep[] = [
    { id: 1, title: 'Fecha', completed: false, active: true },
    { id: 2, title: 'Horario', completed: false, active: false },
    { id: 3, title: 'Datos', completed: false, active: false },
    { id: 4, title: 'Confirmación', completed: false, active: false },
  ];

  minDate: Date | undefined;

  password: string | undefined;

  isCanClient: boolean = false;
  isClientRegistered: boolean = false;
  idUser: number | undefined;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: Store,
    private timeSlotService: TimeSlotService,
    private clientRegisterService: ClientRegisterService
  ) {
    this.minDate = new Date();
    this.bookingForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ'\s]+$/),
          Validators.minLength(2),
        ],
      ],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9+\s-]{7,20}$/)],
      ],
      description: ['', [Validators.maxLength(500)]],
    });

    // Effect to process calendar data
    effect(() => {
      const calendarDays: CalendarDay[] = this.calendarData();
      if (!calendarDays || calendarDays.length === 0) return;

      // Extract available dates
      const dates = calendarDays
        .filter((day) => day.timeSlots.some((slot) => slot.isAvailable))
        .map((day) => new Date(day.date));

      this.availableDates.set(dates);
    });
  }

  ngOnInit(): void {
    // Suscribirse al observable para obtener datos del cliente
    const clientSubscription = this.clientRegisterService
      .getClientById()
      .subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            console.log('Cliente logueado:', response);
            // Prellenar el formulario con los datos del cliente
            this.bookingForm.patchValue({
              name: response.data.fullName,
              clientEmail: response.data.email,
              clientPhoneNumber: response.data.phoneNumber,
            });
            this.isClientRegistered = true;
            this.idUser = response.data.id;
          }
        },
        error: (error) => {
          console.warn(
            'No hay cliente logueado o error al obtener datos:',
            error
          );
          // No mostrar error al usuario ya que es normal no tener cliente logueado
          this.isClientRegistered = false;
          this.idUser = undefined;
        },
      });

    this.subscriptions.add(clientSubscription);

    const today = new Date();
    this.loadCalendar(today.getMonth() + 1, today.getFullYear());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCalendar(month: number, year: number) {
    this.store.dispatch(loadCalendar({ month, year }));
  }

  // Navigation methods
  nextStep() {
    if (this.currentStep() < 4) {
      const current = this.currentStep();
      this.steps[current - 1].completed = true;
      this.steps[current - 1].active = false;

      if (current < 4) {
        this.steps[current].active = true;
      }

      this.currentStep.set(current + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      const current = this.currentStep();
      this.steps[current - 1].active = false;
      this.steps[current - 2].active = true;
      this.steps[current - 2].completed = false;

      this.currentStep.set(current - 1);
    }
  }

  goToStep(step: number) {
    if (step <= this.currentStep()) {
      // Reset steps
      this.steps.forEach((s, index) => {
        s.active = index + 1 === step;
        s.completed = index + 1 < step;
      });
      this.currentStep.set(step);
    }
  }

  // Date selection
  onDateSelect(date: Date) {
    this.selectedDate.set(date);
    this.loadTimeSlotsForDate(date);
    this.nextStep();
  }

  private loadTimeSlotsForDate(date: Date) {
    this.timeSlots.set([]);
    this.isLoading.set(true);

    const calendarDays: CalendarDay[] = this.calendarData();
    const selectedDay = calendarDays.find((day) => {
      const dayDate = new Date(day.date);
      return dayDate.toDateString() === date.toDateString();
    });

    if (selectedDay) {
      this.timeSlotService.getTimeSlots(selectedDay.workingDayId).subscribe({
        next: (response) => {
          console.log(response);
          if (response.success) {
            const availableSlots = response.data.filter(
              (slot: TimeSlot) => slot.isAvailable
            );
            this.timeSlots.set(availableSlots);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los horarios disponibles',
          });
        },
      });
    } else {
      this.isLoading.set(false);
    }
  }

  // Time slot selection
  selectTimeSlot(slot: TimeSlot) {
    this.selectedSlot.set(slot);
    this.nextStep();
  }

  // Form submission
  onSubmit() {
    if (this.bookingForm.valid && this.selectedDate() && this.selectedSlot()) {
      this.isLoading.set(true);

      const formValue = this.bookingForm.value;
      const selectedSlot = this.selectedSlot()!;

      const payload: Appointment = {
        clientId: this.idUser || 0,
        timeSlotId: selectedSlot.id,
        clientName: formValue.name,
        clientEmail: formValue.clientEmail || null,
        clientPhoneNumber: formValue.clientPhoneNumber || null,
        notes: formValue.description ?? null,
        amount: 10000,
      };

      console.log(payload);

      this.store.dispatch(
        createAppointment({
          payload,
          selectedDate: this.selectedDate()!.toISOString(),
        })
      );

      // Simulate API call delay
      setTimeout(() => {
        this.isLoading.set(false);
        this.nextStep();
        this.showConfirmation.set(true);
      }, 2000);
    }
  }

  submitClientRegister() {
    let formData: FormData = new FormData();
    let roleId = 2;

    formData.append('fullName', this.bookingForm.get('name')?.value);
    formData.append(
      'phoneNumber',
      this.bookingForm.get('clientPhoneNumber')?.value
    );
    formData.append('age', '1');
    formData.append('email', this.bookingForm.get('clientEmail')?.value);
    formData.append('password', this.password || '');
    formData.append('roleId', roleId.toString());

    this.clientRegisterService.createClient(formData).subscribe({
      next: (response) => {
        if (response) {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
          });
          this.isClientRegistered = true;

          this.idUser = response.data!.id;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: err.message,
        });
      },
    });
  }

  // Reset booking
  resetBooking() {
    this.currentStep.set(1);
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.showConfirmation.set(false);
    this.bookingForm.reset();

    this.steps.forEach((step, index) => {
      step.completed = false;
      step.active = index === 0;
    });
  }

  // Utility methods
  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.selectedDate();
      case 2:
        return !!this.selectedSlot();
      case 3:
        return this.bookingForm.valid;
      default:
        return true;
    }
  }

  getFormProgress(): number {
    const controls = this.bookingForm.controls;
    let filled = 0;
    const total = 3;

    if (controls['name'].value) filled++;
    if (controls['clientEmail'].value) filled++;
    if (controls['clientPhoneNumber'].value) filled++;

    return Math.round((filled / total) * 100);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  // Calendar date filter
  isDateAvailable = (date: Date): boolean => {
    return this.availableDates().some(
      (availableDate) => availableDate.toDateString() === date.toDateString()
    );
  };

  // Logout functionality
  logout(): void {
    // Limpiar datos del cliente logueado
    this.isClientRegistered = false;
    this.idUser = undefined;

    // Limpiar formulario
    this.bookingForm.reset();

    // Limpiar localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Mensaje de confirmación
    this.messageService.add({
      severity: 'info',
      summary: 'Sesión cerrada',
      detail:
        'Has cerrado sesión correctamente. Ahora puedes reservar como invitado.',
    });
  }
}
