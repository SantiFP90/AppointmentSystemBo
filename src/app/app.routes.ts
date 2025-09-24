import { Routes } from '@angular/router';
import { AuthRoutes } from './auth/auth.routes';
import { MainRoutes } from './main/main.routes';
import { ClientRoutes } from './client/client.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
    children: [
      ...AuthRoutes,
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'client',
    loadComponent: () =>
      import('./client/client.component').then((m) => m.ClientComponent),
    children: [
      ...ClientRoutes,
      {
        path: '**',
        redirectTo: 'appointmentsClient',
      },
    ],
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
    children: [
      ...MainRoutes,
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'client/appointmentsClient',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'client/appointmentsClient',
  },
];
