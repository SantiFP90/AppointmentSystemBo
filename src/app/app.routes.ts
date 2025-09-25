import { Routes } from '@angular/router';
import { AuthRoutes } from './auth/auth.routes';
import { authGuard } from './auth/guards/auth.guard';
import { roleGuard } from './auth/guards/role.guard';
import { ClientRoutes } from './client/client.routes';
import { MainRoutes } from './main/main.routes';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
    children: [
      ...AuthRoutes,
      {
        path: '**',
        redirectTo: 'welcome',
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
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
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
    redirectTo: 'auth/welcome',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/welcome',
  },
];
