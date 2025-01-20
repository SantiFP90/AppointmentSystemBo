import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet></router-outlet>`,
  styleUrl: './auth.component.scss',
})
export class AuthComponent {}
