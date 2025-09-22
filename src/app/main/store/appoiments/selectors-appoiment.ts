import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppoimentState } from './reducer-appoiment';

export const selectAppoimentState =
  createFeatureSelector<AppoimentState>('appoiment');

export const selectAppoiment = createSelector(
  selectAppoimentState,
  (state) => state.appoiment
);
export const selectAppoimentLoading = createSelector(
  selectAppoimentState,
  (state) => state.loading
);
