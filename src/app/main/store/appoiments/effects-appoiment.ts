import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AppoimentService } from '../../services/appoiment.service';
import { loadCalendar } from '../calendar/actions-calendar';
import * as AppoimentActions from './actions-appoiment';

@Injectable({
  providedIn: 'root',
})
export class EffectsAppoiment {
  constructor(
    private actions$: Actions,
    private appoimentService: AppoimentService
  ) {}

  loadAppoiment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppoimentActions.loadAppoiment),
      switchMap(({ page, pageSize }) =>
        this.appoimentService.getAppoiment(page, pageSize).pipe(
          map((response) =>
            AppoimentActions.loadAppoimentSuccess({
              appointment: response.data!.items,
            })
          ),
          catchError((error) =>
            of(AppoimentActions.loadAppoimentFailure({ error }))
          )
        )
      )
    )
  );

  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppoimentActions.createAppointment),
      switchMap(({ payload, selectedDate }) =>
        this.appoimentService.createAppointment(payload).pipe(
          switchMap(() => {
            const date = new Date(selectedDate);
            return [
              AppoimentActions.createAppointmentSuccess(),
              loadCalendar({
                month: date.getMonth() + 1,
                year: date.getFullYear(),
              }),
            ];
          }),
          catchError((error) =>
            of(AppoimentActions.createAppointmentFailure({ error }))
          )
        )
      )
    )
  );
}
