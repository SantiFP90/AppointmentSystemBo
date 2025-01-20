import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet> </router-outlet> `,
  styleUrl: './client.component.scss',
})
export class ClientComponent {}
