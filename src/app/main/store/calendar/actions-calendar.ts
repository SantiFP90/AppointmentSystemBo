import { createAction, props } from '@ngrx/store';
import { CalendarDay } from '../../Interfaces/calendar-appoiments.interface';

export const loadCalendar = createAction(
  '[Calendar] Load Calendar',
  props<{ month: number; year: number }>()
);

export const loadCalendarSuccess = createAction(
  '[Calendar] Load Calendar Success',
  props<{ calendar: CalendarDay[] }>()
);

export const loadCalendarFailure = createAction(
  '[Calendar] Load Calendar Failure',
  props<{ error: string }>()
);
