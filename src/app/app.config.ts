import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { authInterceptor } from './auth/service/interceptor.service';
import { EffectsAppoiment } from './main/store/appoiments/effects-appoiment';
import { appoimentReducer } from './main/store/appoiments/reducer-appoiment';
import { EffectsCalendar } from './main/store/calendar/effects-calendar';
import { calendarReducer } from './main/store/calendar/reducer-calendar';

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    MessageService,
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(ReactiveFormsModule, FormsModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideStore({ appoiment: appoimentReducer, calendar: calendarReducer }),
    provideEffects([EffectsAppoiment, EffectsCalendar]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
};
