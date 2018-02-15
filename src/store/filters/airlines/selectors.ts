import { createSelector } from 'reselect';
import { ApplicationState } from '../../../state';
import { createMap, getFlights, getListOfSelectedCodes, ObjectsMap } from '../selectors';
import Airline from '../../../schemas/Airline';
import Flight from '../../../schemas/Flight';

export const getFilteredAirlines = (state: ApplicationState): string[] => state.filters.airlines;

export const getSelectedAirlinesList = createSelector([getFilteredAirlines], getListOfSelectedCodes);

export const getAirlinesList = createSelector(
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

export const getAirlinesMap = createSelector(
	[getAirlinesList],
	(airlines: Airline[]): ObjectsMap<Airline> => {
		return createMap<Airline>(airlines);
	}
);

export const getSelectedAirlinesObjects = createSelector(
	[getAirlinesMap, getFilteredAirlines],
	(airlinesMap: ObjectsMap<Airline>, airlinesCodes: string[]): Airline[] => {
		return airlinesCodes.map(code => airlinesMap[code]);
	}
);
