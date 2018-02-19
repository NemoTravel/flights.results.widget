import { createSelector } from 'reselect';
import { ApplicationState, FlightTimeType, LocationType } from '../../../state';
import { getListOfSelectedCodes } from '../selectors';

export const getFilteredDepartureTimeIntervals = (state: ApplicationState): FlightTimeType[] => state.filters.time[LocationType.Departure];
export const getFilteredArrivalTimeIntervals = (state: ApplicationState): FlightTimeType[] => state.filters.time[LocationType.Arrival];

export const getSelectedDepartureTimeIntervals = createSelector([getFilteredDepartureTimeIntervals], getListOfSelectedCodes);
export const getSelectedArrivalTimeIntervals = createSelector([getFilteredArrivalTimeIntervals], getListOfSelectedCodes);
