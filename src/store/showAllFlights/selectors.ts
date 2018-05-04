import { createSelector } from 'reselect';
import { ApplicationState } from '../../state';
import Flight from '../../models/Flight';
import { getFlightsForCurrentLeg } from '../flights/selectors';
import { MAX_VISIBLE_FLIGHTS } from '../../utils';

export const getShowAllFlights = (state: ApplicationState): boolean => state.showAllFlights;

export const shouldHideFlights = createSelector(
	[getShowAllFlights, getFlightsForCurrentLeg],
	(showAllFlights: boolean, flights: Flight[]): boolean => {
		return !showAllFlights && flights.length > MAX_VISIBLE_FLIGHTS;
	}
);
