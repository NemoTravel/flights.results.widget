import { getFlightsIdsByLegs } from '../flightsByLegs/selectors';
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
 * Get an array of all flights on the current selected leg.
 *
 * @param {RootState} state
 * @returns {Flight[]}
 */
export const getFlightsForCurrentLeg = createSelector(
	[getAllFlights, getFlightsIdsByLegs, getCurrentLegId],
	(allFlights: FlightsState, flightsByLegs: FlightsByLegsState, legId: number): Flight[] => {
		const flightsIds = flightsByLegs.hasOwnProperty(legId) ? flightsByLegs[legId] : [];
		const result: Flight[] = [];

		flightsIds.forEach(flightId => {
			if (allFlights.hasOwnProperty(flightId)) {
				result.push(allFlights[flightId]);
			}
		});

		return result;
	}
);
