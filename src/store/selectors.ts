import { createSelector } from 'reselect';
import { ApplicationState } from '../main';
import Flight from '../schemas/Flight';
import Airline from '../schemas/Airline';
import Airport from '../schemas/Airport';

const getFlights = (state: ApplicationState): Flight[] => state.flights;

export const getAirlinesList = createSelector(
	[ getFlights ],
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

const getAirportsList = (flights: Flight[], type: string): Airport[] => {
	const airports: Airport[] = [];
	const airportsMap: { [IATA: string]: any } = {};

	flights.forEach(({ segments }) => {
		segments.forEach(segment => {
			const airport = type === 'departure' ? segment.depAirport : segment.arrAirport;
			const IATA = airport.IATA;

			if (!airportsMap.hasOwnProperty(IATA)) {
				airportsMap[IATA] = true;
				airports.push(airport);
			}
		});
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

export const getDepartureAirportsList = createSelector(
	[ getFlights ],
	(flights: Flight[]): Airport[] => getAirportsList(flights, 'departure')
);

export const getArrivalAirportsList = createSelector(
	[ getFlights ],
	(flights: Flight[]): Airport[] => getAirportsList(flights, 'arrival')
);
