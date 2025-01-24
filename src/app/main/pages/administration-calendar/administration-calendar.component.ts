import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './administration-calendar.component.html',
  styleUrl: './administration-calendar.component.scss',
})
export class AdministrationCalendarComponent implements OnInit {
  // Planning Period Options
  planningPeriodOptions = [
    { label: 'Mensual', value: 'monthly' },
    { label: 'Anual', value: 'yearly' },
  ];
  selectedPlanningPeriod?: string | null;

  // Days Options
  daysOptions = [
    { name: 'Lunes', code: 'MON' },
    { name: 'Martes', code: 'TUE' },
    { name: 'Miércoles', code: 'WED' },
    { name: 'Jueves', code: 'THU' },
    { name: 'Viernes', code: 'FRI' },
    { name: 'Sábado', code: 'SAT' },
    { name: 'Domingo', code: 'SUN' },
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
  selectedInterval?: number | null;

  // Work Shift Options
  workShiftOptions = [
    { label: '8hs a 13hs y 14hs a 17hs', value: 'shift1' },
    { label: '9hs a 13hs y 14hs a 18hs', value: 'shift2' },
  ];
  selectedWorkShifts: any[] = [];
  customWorkShifts: any[] = [];

  // Weekend Options
  weekendOptions = [
    { name: 'Trabajar sábados y domingos', code: 'ALL_WEEKEND' },
    { name: 'Sábados y domingos', code: 'WEEKEND' },
    { name: 'Solo sábados', code: 'SATURDAY' },
    { name: 'Solo sábados por la mañana', code: 'SATURDAY_MORNING' },
  ];
  selectedWeekendOption: any;

  // Holiday Options
  holidaysEnabled: boolean = false;
  holidayOptions: any[] = [];
  selectedHolidays: any[] = [];

  ngOnInit(): void {
    // Populate holiday options based on current month
    this.populateHolidayOptions();
  }

  populateHolidayOptions() {
    // Logic to dynamically fetch holidays for current month
    const currentMonth = new Date().getMonth();
    // Example mock data
    this.holidayOptions = [
      { name: 'Año Nuevo', date: '2024-01-01' },
      { name: 'Otro Feriado', date: '2024-01-15' },
    ];
  }

  addWorkShift() {
    const newShift = {
      label: `Turno personalizado ${this.customWorkShifts.length + 1}`,
      value: `custom_${this.customWorkShifts.length}`,
    };
    this.customWorkShifts.push(newShift);
    this.selectedWorkShifts.push(newShift);
  }

  saveConfiguration() {
    console.log('Configuración guardada:', {
      planningPeriod: this.selectedPlanningPeriod,
      selectedDays: this.selectedDays,
      interval: this.selectedInterval,
      workShifts: this.selectedWorkShifts,
      weekendOption: this.selectedWeekendOption,
      holidays: this.selectedHolidays,
    });
  }

  cancelConfiguration() {
    // Reset all configurations
    this.selectedPlanningPeriod = null;
    this.selectedDays = [];
    this.selectedInterval = null;
    this.selectedWorkShifts = [];
    this.selectedWeekendOption = null;
    this.holidaysEnabled = false;
    this.selectedHolidays = [];
  }
}
