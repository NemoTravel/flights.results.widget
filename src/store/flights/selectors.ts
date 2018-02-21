import { getCurrentLegId, getFlightsIdsByLegs, getFlightsPool } from '../filters/selectors';
import { createSelector } from 'reselect';
import Flight from '../../schemas/Flight';
import { FlightsByLegsState, FlightsState } from '../../state';

/**
 * Get an array of all flights on the current selected leg.
 *
 * @param {ApplicationState} state
 * @returns {Flight[]}
 */
export const getFlights = createSelector(
	[getFlightsPool, getFlightsIdsByLegs, getCurrentLegId],
	(allFlights: FlightsState, flightsByLegs: FlightsByLegsState, legId: number): Flight[] => {
		const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];

		return flightsIds.map(flightId => allFlights[flightId]);
	}
);
