import { createReducer, on } from '@ngrx/store';
import { CalendarDay } from '../../Interfaces/calendar-appoiments.interface';
import * as CalendarActions from './actions-calendar';

export interface CalendarState {
  calendar: CalendarDay[];
  loading: boolean;
  error: string | null;
}

export const initialState: CalendarState = {
  calendar: [],
  loading: false,
  error: null,
};

export const calendarReducer = createReducer(
  initialState,
  on(CalendarActions.loadCalendar, (state, { month, year }) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CalendarActions.loadCalendarSuccess, (state, { calendar }) => ({
    ...state,
    calendar: calendar,
    loading: false,
  })),
  on(CalendarActions.loadCalendarFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
  // Add Appointment
  //   on(CalendarActions.addAppoimentOnCalendar, (state, { appointment }) => ({
  //     ...state,
  //     calendar: [...state.calendar, appointment],
  //   })),
);
