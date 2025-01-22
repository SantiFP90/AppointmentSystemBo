import { Routes } from '@angular/router';

export const MainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import(
            '../shared/components/app-calendar/app-calendar.component'
          ).then((c) => c.AppCalendarComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile/profile.component').then(
            (c) => c.ProfileComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
