import { Routes } from '@angular/router';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'welcome',
        loadComponent: () =>
          import('./pages/welcome/welcome.component').then(
            (c) => c.WelcomeComponent
          ),
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    ],
  },
];
