import { createSelector } from 'reselect';
import Airline from '../../schemas/Airline';
import Airport from '../../schemas/Airport';
import Flight from '../../schemas/Flight';
import { ApplicationState, LocationType } from '../../state';

export interface ListOfSelectedCodes {
	[IATA: string]: boolean;
}

const getFlights = (state: ApplicationState): Flight[] => state.flights;

const getListOfSelectedCodes = (codes: string[]): ListOfSelectedCodes => {
	const defaultList: ListOfSelectedCodes = {};

	return codes.reduce((result: ListOfSelectedCodes, code: string): ListOfSelectedCodes => {
		return {
			...result,
			[code]: true
		};
	}, defaultList);
};

export const getIsDirectOnly = (state: ApplicationState): boolean => state.filters.directOnly;
export const getFilteredAirlines = (state: ApplicationState): string[] => state.filters.airlines;
export const getFilteredDepartureAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Departure];
export const getFilteredArrivalAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Arrival];

export const getSelectedAirlinesList = createSelector([getFilteredAirlines], getListOfSelectedCodes);
export const getSelectedDepartureAirportsList = createSelector([getFilteredDepartureAirports], getListOfSelectedCodes);
export const getSelectedArrivalAirportsList = createSelector([getFilteredArrivalAirports], getListOfSelectedCodes);

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

export const getAirportsList = (flights: Flight[], type: string): Airport[] => {
	const airports: Airport[] = [];
	const airportsMap: { [IATA: string]: any } = {};

	flights.forEach(({ segments }) => {
		const segment = type === 'departure' ? segments[0] : segments[segments.length - 1];
		const firstSegmentAirport = type === 'departure' ? segment.depAirport : segment.arrAirport;

		if (!airportsMap.hasOwnProperty(firstSegmentAirport.IATA)) {
			airportsMap[firstSegmentAirport.IATA] = true;
			airports.push(firstSegmentAirport);
		}
	});

	return airports.sort((a, b) => {
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
};

export const getDepartureAirportsList = createSelector([getFlights], (flights: Flight[]): Airport[] => getAirportsList(flights, 'departure'));
export const getArrivalAirportsList = createSelector([getFlights], (flights: Flight[]): Airport[] => getAirportsList(flights, 'arrival'));