import { getCurrentLegId, getFlightsIdsByLegs } from '../filters/selectors';
import { createSelector } from 'reselect';
import Flight from '../../schemas/Flight';
import { ApplicationState, FlightsByLegsState, FlightsState } from '../../state';

/**
 * Get list of flights grouped by flight id.
 *
 * @param {ApplicationState} state
 * @returns {FlightsState}
 */
export const getFlightsPool = (state: ApplicationState): FlightsState => state.flights;

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
