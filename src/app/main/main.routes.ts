import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { MainComponent } from './main.component';

export const MainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
