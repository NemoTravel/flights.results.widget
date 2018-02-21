import { createSelector } from 'reselect';
import { ApplicationState } from '../../../state';
import { createMap, getListOfSelectedCodes, ObjectsMap } from '../selectors';
import Airline from '../../../schemas/Airline';
import Flight from '../../../schemas/Flight';
import { getFlights } from '../../flights/selectors';

/**
 * Get an array of airlines codes used for filtering.
 *
 * @param {ApplicationState} state
 * @returns {string[]}
 */
export const getFilteredAirlines = (state: ApplicationState): string[] => state.filters.airlines;

export const getSelectedAirlinesList = createSelector([getFilteredAirlines], getListOfSelectedCodes);

/**
 * Get all airlines participating in all flights.
 */
export const getAllAirlines = createSelector(
	[getFlights],
	(flights: Flight[]): Airline[] => {
		const airlines: Airline[] = [];
		const airlinesMap: { [IATA: string]: any } = {};

		flights.forEach(({ segments }) => {
			segments.forEach(segment => {
				const IATA = segment.airline.IATA;

				if (!airlinesMap.hasOwnProperty(IATA)) {
					airlinesMap[IATA] = true;
					airlines.push(segment.airline);
				}
			});
		});

		return airlines.sort((a, b) => {
			const nameA = a.name;
			const nameB = b.name;

			if (nameA < nameB) {
				return -1;
			}

			if (nameA > nameB) {
				return 1;
			}

			return 0;
		});
	}
);

/**
 * Map of `airlineCode` => `airlineObject`.
 */
export const getAirlinesMap = createSelector(
	[getAllAirlines],
	(airlines: Airline[]): ObjectsMap<Airline> => {
		return createMap<Airline>(airlines);
	}
);

/**
 * Get an array of airlines selected in filters.
 */
export const getSelectedAirlinesObjects = createSelector(
	[getAirlinesMap, getFilteredAirlines],
	(airlinesMap: ObjectsMap<Airline>, airlinesCodes: string[]): Airline[] => {
		return airlinesCodes.map(code => airlinesMap[code]);
	}
);
