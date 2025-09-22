import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { WorkingDaysService } from '../../services/working-days.service';

@Component({
  selector: 'app-administration-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    AccordionModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    RadioButtonModule,
    ReactiveFormsModule,
    ToastModule,
  ],
  templateUrl: './administration-calendar.component.html',
  styleUrl: './administration-calendar.component.scss',
  providers: [MessageService],
})
export class AdministrationCalendarComponent implements OnInit {
  // Days Options
  daysOptions = [
    { name: 'Lunes', code: 'MON', value: 1 },
    { name: 'Domingo', code: 'SUN', value: 0 },
    { name: 'Martes', code: 'TUE', value: 2 },
    { name: 'Miércoles', code: 'WED', value: 3 },
    { name: 'Jueves', code: 'THU', value: 4 },
    { name: 'Viernes', code: 'FRI', value: 5 },
    { name: 'Sábado', code: 'SAT', value: 6 },
  ];
  selectedDays: any[] = [];

  // Interval Options
  intervalOptions = [
    { label: '15 minutos', value: 15 },
    { label: '25 minutos', value: 25 },
    { label: '30 minutos', value: 30 },
    { label: '35 minutos', value: 35 },
    { label: '1 hora', value: 60 },
  ];

  constructor(
    private fb: FormBuilder,
    private workingDaysService: WorkingDaysService,
    private messageService: MessageService
  ) {}

  calendarForm: FormGroup = this.fb.group({
    startDate: [[new Date()], Validators.required],
    endDate: [[new Date()], Validators.required],
    startTime: [null, Validators.required],
    endTime: [null, Validators.required],
    days: [[]],
    slotDurationMinutes: [[''], Validators.required],
  });

  ngOnInit(): void {}

  saveConfiguration() {
    if (this.calendarForm.valid) {
      const formValue = { ...this.calendarForm.value };

      const formatTime = (date: Date | null): string | null => {
        if (!date) return null;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      formValue.startTime = formatTime(this.calendarForm.value.startTime);
      formValue.endTime = formatTime(this.calendarForm.value.endTime);

      this.workingDaysService.createWorkingDay(formValue).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro',
            detail: `Jornada registrada con éxito`,
          });
          this.cancelConfiguration();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error al registrar la jornada: ${error.message}`,
          });
        },
      });
    } else {
      this.calendarForm.markAllAsTouched();
    }
  }

  cancelConfiguration() {
    this.calendarForm.reset({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      days: [],
      slotDurationMinutes: '',
    });
  }
}
