import { createSelector } from 'reselect';
import { ApplicationState, FlightTimeInterval, LocationType } from '../../../state';
import { getListOfSelectedCodes } from '../selectors';

export const getFilteredDepartureTimeIntervals = (state: ApplicationState): FlightTimeInterval[] => state.filters.time[LocationType.Departure];
export const getFilteredArrivalTimeIntervals = (state: ApplicationState): FlightTimeInterval[] => state.filters.time[LocationType.Arrival];

export const getSelectedDepartureTimeIntervals = createSelector([getFilteredDepartureTimeIntervals], getListOfSelectedCodes);
export const getSelectedArrivalTimeIntervals = createSelector([getFilteredArrivalTimeIntervals], getListOfSelectedCodes);
