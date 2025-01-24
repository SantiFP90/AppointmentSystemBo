import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

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
  @ViewChild('dt2') dt2!: Table;
  public clients = [
    {
      name: 'Santiago Fernandez',
      dni: '43949312',
      date: '23/01/2025',
      asist: 'Asistió',
    },
    {
      name: 'Sebastian Fernandez',
      dni: '43949992',
      date: '23/01/2025',
      asist: 'Asistió',
    },
    {
      name: 'Federico Silva',
      dni: '43949311',
      date: '23/01/2025',
      asist: 'No asistió',
    },
    {
      name: 'Julian Alvarez',
      dni: '43999312',
      date: '23/01/2025',
      asist: 'Asistió',
    },
    {
      name: 'Lionel Messi',
      dni: '42989312',
      date: '23/01/2025',
      asist: 'No asistió',
    },
  ];

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  applyGlobalFilter(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    if (this.dt2) {
      this.dt2.filterGlobal(inputValue, 'contains');
    }
  }
}
