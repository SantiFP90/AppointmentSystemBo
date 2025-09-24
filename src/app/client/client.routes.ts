import { Routes } from '@angular/router';

export const ClientRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appointmentsClient',
        loadComponent: () =>
          import('./pages/client-booking/client-booking.component').then(
            (c) => c.ClientBookingComponent
          ),
      },
      { path: '', redirectTo: 'appointmentsClient', pathMatch: 'full' },
    ],
  },
];
