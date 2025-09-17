import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState } from './reducer-calendar';

export const selectCalendarState =
  createFeatureSelector<CalendarState>('calendar');

export const selectCalendar = createSelector(
  selectCalendarState,
  (state) => state.calendar
);

export const selectCalendarLoading = createSelector(
  selectCalendarState,
  (state) => state.loading
);

export const selectCalendarError = createSelector(
  selectCalendarState,
  (state) => state.error
);
