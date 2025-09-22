import { createAction, props } from '@ngrx/store';
import { Appointment } from '../../Interfaces/appoiment.interface';

export const loadAppoiment = createAction(
  '[Appoiment] Load Appoiment',
  props<{ page: number; pageSize: number }>()
);

export const loadAppoimentSuccess = createAction(
  '[Appoiment] Load Appoiment Success',
  props<{ appointment: Appointment[] }>()
);

export const loadAppoimentFailure = createAction(
  '[Appoiment] Load Appoiment Failure',
  props<{ error: string }>()
);

export const addloadAppoiment = createAction(
  '[Appoiment] Add Appoiment Success',
  props<{ appointment: Appointment }>()
);

export const createAppointment = createAction(
  '[Appoiment] Create Appointment',
  props<{
    payload: Appointment;
    selectedDate: string;
  }>()
);

export const createAppointmentSuccess = createAction(
  '[Appoiment] Create Appointment Success'
);

export const createAppointmentFailure = createAction(
  '[Appoiment] Create Appointment Failure',
  props<{ error: string }>()
);
