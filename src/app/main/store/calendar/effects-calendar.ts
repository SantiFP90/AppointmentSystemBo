import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppoimentService } from '../../services/appoiment.service';
import * as CalendarActions from './actions-calendar';

@Injectable({
  providedIn: 'root',
})
export class EffectsCalendar {
  constructor(
    private actions$: Actions,
    private appoimentService: AppoimentService
  ) {}

  loadCalendar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActions.loadCalendar),
      switchMap(({ month, year }) =>
        this.appoimentService.getAppoimentByMonthYear(month, year).pipe(
          map((calendar) =>
            CalendarActions.loadCalendarSuccess({
              calendar: calendar.data!,
            })
          ),
          catchError((error) =>
            of(CalendarActions.loadCalendarFailure({ error }))
          )
        )
      )
    )
  );
}
