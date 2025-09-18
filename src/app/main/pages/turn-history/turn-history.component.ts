import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  AppointmentStatus,
  AppointmentStatusEs,
} from '../../../shared/enum/state.enum';
import { Appointment } from '../../Interfaces/appoiment.interface';
import { AppoimentService } from '../../services/appoiment.service';

@Component({
  selector: 'app-turn-history',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './turn-history.component.html',
  styleUrl: './turn-history.component.scss',
})
export class TurnHistoryComponent {
  searchValue: string | undefined;

  clients = signal<Appointment[] | undefined>(undefined);

  totalRecords = 0;

  AppointmentStatusEs = AppointmentStatusEs;

  constructor(private appoimentService: AppoimentService) {}

  ngOnInit() {
    this.loadClientsLazy({ first: 0, rows: 10 });
  }

  loadClientsLazy(event: TableLazyLoadEvent) {
    const page = event.first! / event.rows! + 1;
    const size = event.rows!;

    this.appoimentService
      .getAppoiment(page, size, this.searchValue)
      .subscribe((response) => {
        this.clients.set(response.data?.items ?? []);
        this.totalRecords = response.data?.totalItems ?? 0;
      });
  }

  getStatusText(client: Appointment): string {
    return (
      AppointmentStatusEs[client.status as AppointmentStatus] ?? 'Desconocido'
    );
  }

  clear() {
    this.searchValue = '';
    this.loadClientsLazy({ first: 0, rows: 10 });
  }
}
