import { RootState } from '../../reducers';
import { createSelector } from 'reselect';
import { getAllAirlines } from '../airlines/selectors';
import { getAirlinesIATA, getSelectedFlights } from '../../selectedFlights/selectors';
import { getDepartureAirports } from '../airports/selectors';
import Airline from '../../../schemas/Airline';
import Flight from '../../../models/Flight';
import Airport from '../../../schemas/Airport';
import { isFirstLeg } from '../../currentLeg/selectors';
import { getFilteredFlights } from '../../selectors';

export const getIsComfortable = (state: RootState): boolean => state.filters.comfortable;

export const isComfortableFlightExists = createSelector(
	[getFilteredFlights, getSelectedFlights],
	(visibleFlights: Flight[], selectedFlights: Flight[]): boolean => {
		const prevLegArrival = selectedFlights.length ? selectedFlights[selectedFlights.length - 1].lastSegment.arrAirport.IATA : null,
			airlinesIATA = getAirlinesIATA(selectedFlights);

		return !!visibleFlights.find(flight => {
			if (flight.firstSegment.depAirport.IATA === prevLegArrival) {
				return !!flight.segments.find(segment => {
					return airlinesIATA.hasOwnProperty(segment.airline.IATA);
				});
			}
		});
	}
);

const isOneNotComfortableAirlineExists = createSelector(
	[getAllAirlines, getSelectedFlights],
	(allAirlinesInLeg: Airline[], selectedFlights: Flight[]): boolean => {
		const airlinesIATA = getAirlinesIATA(selectedFlights);

		return !!allAirlinesInLeg.find(airline => {
			return !airlinesIATA.hasOwnProperty(airline.IATA);
		});
	}
);

const isOneNotComfortableAirportExists = createSelector(
	[getDepartureAirports, getSelectedFlights],
	(departureAirports: Airport[], selectedFlights: Flight[]): boolean => {
		const prevLegArrival = selectedFlights.length ? selectedFlights[selectedFlights.length - 1].lastSegment.arrAirport.IATA : null;

		return !!departureAirports.find(airline => {
			return airline.IATA !== prevLegArrival;
		});
	}
);

export const isComfortableFilterEnabled = createSelector(
	[
		isFirstLeg,
		isComfortableFlightExists,
		isOneNotComfortableAirlineExists,
		isOneNotComfortableAirportExists
	],
	(
		isFirstLeg: boolean,
		isComfortableFlightExists: boolean,
		isOtherAirlineExists: boolean,
		isOtherAirportExists: boolean
	): boolean => !isFirstLeg && isComfortableFlightExists && (isOtherAirlineExists || isOtherAirportExists)
);
