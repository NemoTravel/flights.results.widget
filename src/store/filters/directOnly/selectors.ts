import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { getFlightsForCurrentLeg } from '../../flights/selectors';
import Flight from '../../../models/Flight';

export const getIsDirectOnly = (state: RootState): boolean => state.filters.directOnly;

/**
 * Check if there are any transfer flights.
 */
export const hasAnyTransferFlights = createSelector(
	[getFlightsForCurrentLeg],
	(flights: Flight[]): boolean => {
		const numOfTransferFlights = flights.filter(flight => flight.segments.length > 1).length;

		return numOfTransferFlights > 1 && numOfTransferFlights !== flights.length;
	}
);
