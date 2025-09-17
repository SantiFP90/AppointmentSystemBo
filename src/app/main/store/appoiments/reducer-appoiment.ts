import { createReducer, on } from '@ngrx/store';
import { Appointment } from '../../Interfaces/appoiment.interface';
import * as AppointmentActions from './actions-appoiment';

export interface AppoimentState {
  appoiment: Appointment[];
  loading: boolean;
  error: string | null;
}

export const initialState: AppoimentState = {
  appoiment: [],
  loading: false,
  error: null,
};

export const appoimentReducer = createReducer(
  initialState,
  on(AppointmentActions.loadAppoiment, (state) => ({
    ...state,
    loading: true,
  })),
  on(AppointmentActions.loadAppoimentSuccess, (state, { appointment }) => ({
    ...state,
    appoiment: appointment,
    loading: false,
  })),
  on(AppointmentActions.loadAppoimentFailure, (state, { error }) => ({
    ...state,
    error: error,
    loading: false,
  }))
);
