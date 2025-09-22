import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { EffectsAppoiment } from './main/store/appoiments/effects-appoiment';
import { appoimentReducer } from './main/store/appoiments/reducer-appoiment';
import { EffectsCalendar } from './main/store/calendar/effects-calendar';
import { calendarReducer } from './main/store/calendar/reducer-calendar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    importProvidersFrom(ReactiveFormsModule, FormsModule),
    provideHttpClient(),
    provideAnimations(),
    provideStore({ appoiment: appoimentReducer, calendar: calendarReducer }),
    provideEffects([EffectsAppoiment, EffectsCalendar]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
};
