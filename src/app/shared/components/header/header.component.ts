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
      command: () => {
        this.router.navigate(['/main/administration']);
      },
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
      command: () => {
        this.router.navigate(['/main/history']);
      },
    },
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-lock',
        },
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
        },
        {
          label: 'Cambiar contraseña',
          icon: 'pi pi-replay',
        },
      ],
    },
  ];

  goHome() {
    this.router.navigate(['/main/dashboard']);
  }
}
