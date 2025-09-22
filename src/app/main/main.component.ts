import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/components/header/header.component';
import { TranslateCalendarService } from '../shared/services/translate-calendar.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div><app-header /></div>
    <router-outlet />
  `,
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(private translateCalendarService: TranslateCalendarService) {
    this.translateCalendarService.configureCalendarToSpanish();
  }
}
