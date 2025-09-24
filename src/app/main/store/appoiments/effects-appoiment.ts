import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppoimentService } from '../../services/appoiment.service';
import { loadCalendar } from '../calendar/actions-calendar';
import * as AppoimentActions from './actions-appoiment';

@Injectable({
  providedIn: 'root',
})
export class EffectsAppoiment {
  constructor(
    private actions$: Actions,
    private appoimentService: AppoimentService,
    private messageService: MessageService
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

  createAppointmentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppoimentActions.createAppointmentSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Turno Registrado',
            detail: 'El turno fue creado con éxito.',
          });
        })
      ),
    { dispatch: false }
  );

  createAppointmentFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppoimentActions.createAppointmentFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el turno.',
          });
        })
      ),
    { dispatch: false }
  );
}
