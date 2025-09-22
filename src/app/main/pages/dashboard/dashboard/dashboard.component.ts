import { Component, effect, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CountAppoiments } from '../../../Interfaces/count-appoiment.interface';
import { AppoimentService } from '../../../services/appoiment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  data: any;

  options: any;

  countAppoiment = signal<CountAppoiments>({
    availableAppointments: 0,
    pedingAppointmentsToday: 0,
    pendingAppoimentsThisWeek: 0,
  });

  constructor(
    private router: Router,
    private appoimentService: AppoimentService
  ) {
    effect(() => {
      const counters = this.countAppoiment();
      if (!this.data) return;
      this.data.datasets[0].data = [counters.availableAppointments];
      this.data.datasets[1].data = [counters.pedingAppointmentsToday];
      this.data.datasets[2].data = [counters.pendingAppoimentsThisWeek];
    });
  }

  ngOnInit() {
    this.getCountAppoiments();
  }

  getCountAppoiments() {
    this.appoimentService.getCountAppoiments().subscribe((response) => {
      this.countAppoiment.set(response.data!);
      this.initChart();
    });
  }

  goCalendar() {
    this.router.navigate(['main/calendar']);
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['Turnos'],
      datasets: [
        {
          type: 'bar',
          label: 'Turnos',
          backgroundColor: documentStyle.getPropertyValue(
            'rgba(255, 159, 64, 0.2)'
          ),
          data: [this.countAppoiment().availableAppointments],
        },
        {
          type: 'bar',
          label: 'Pendientes Hoy',
          backgroundColor: documentStyle.getPropertyValue(
            'rgba(54, 163, 235, 0.9)'
          ),
          data: [this.countAppoiment().pedingAppointmentsToday],
        },
        {
          type: 'bar',
          label: 'Pendientes Esta Semana',
          backgroundColor: documentStyle.getPropertyValue(
            'rgba(153, 102, 255, 0.2)'
          ),
          data: [this.countAppoiment().pendingAppoimentsThisWeek],
        },
      ],
    };
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          stacked: false,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
