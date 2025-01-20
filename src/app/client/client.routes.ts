import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about/about.component';
import { HomeComponent } from './pages/home/home/home.component';
import { ClientComponent } from './client.component';

export const ClientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
