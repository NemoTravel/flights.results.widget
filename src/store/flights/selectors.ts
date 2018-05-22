import { getFlightsIdsByLegs } from '../filters/selectors';
import { createSelector } from 'reselect';
import Flight from '../../models/Flight';
import { FlightsState } from './reducers';
import { getCurrentLegId } from '../currentLeg/selectors';
import { RootState } from '../reducers';
import { FlightsByLegsState } from '../flightsByLegs/reducers';

/**
 * Get list of flights grouped by flight id.
 *
 * @param {RootState} state
 * @returns {FlightsState}
 */
export const getAllFlights = (state: RootState): FlightsState => state.flights;

/**
 * Check if there are any loaded flights.
 */
export const hasAnyFlights = createSelector(
	[getAllFlights],
	(allFlights: FlightsState): boolean => !!Object.keys(allFlights).length
);

/**
 * Get an array of all flights on the current selected leg.
 *
 * @param {RootState} state
 * @returns {Flight[]}
 */
export const getFlightsForCurrentLeg = createSelector(
	[getAllFlights, getFlightsIdsByLegs, getCurrentLegId],
	(allFlights: FlightsState, flightsByLegs: FlightsByLegsState, legId: number): Flight[] => {
		const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];

		return flightsIds.map(flightId => allFlights[flightId]);
	}
);
