import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private router: Router) {}

  public items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => {
        this.router.navigate(['/main/dashboard']);
      },
    },
    {
      label: 'Administrar calendario',
      icon: 'pi pi-file-edit',
    },
    {
      label: 'Calendario',
      icon: 'pi pi-calendar',
      command: () => {
        this.router.navigate(['/main/calendar']);
      },
    },
    {
      label: 'Historial',
      icon: 'pi pi-clock',
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
    },
  ];
}
