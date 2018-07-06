import { RootState } from '../reducers';
import { createSelector } from 'reselect';

export const getResultsInfo = (state: RootState) => state.results;

export const getResultsURL = createSelector([ getResultsInfo ], infos => infos.map(({ id }) => id).join('/'));
