import { Routes } from '@angular/router';

export const ClientRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./pages/about/about/about.component').then(
            (c) => c.AboutComponent
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
