import { createSelector } from 'reselect';
import { ApplicationState } from '../main';
import Flight from '../schemas/Flight';
import Airline from '../schemas/Airline';
import Airport from '../schemas/Airport';
import Segment from '../schemas/Segment';

export interface SelectedAirlinesList {
	[IATA: string]: boolean;
}

const getFlights = (state: ApplicationState): Flight[] => state.flights;
const getFilteredAirlines = (state: ApplicationState): string[] => state.filters.airlines;

export const getSelectedAirlinesList = createSelector(
	[ getFilteredAirlines ],
	(airlinesCodes: string[]): SelectedAirlinesList => {
		return airlinesCodes.reduce((result: SelectedAirlinesList, code): SelectedAirlinesList => ({ ...result, [code]: true }), {});
	}
);

export const getVisibleFlights = createSelector(
	[ getFlights, getSelectedAirlinesList ],
	(flights: Flight[], selectedAirlines: SelectedAirlinesList): Flight[] => flights.filter(flight => {
		return !Object.keys(selectedAirlines).length || !!flight.segments.find(segment => segment.airline.IATA in selectedAirlines);
	})
);

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

const getSegmentAirport = (segment: Segment, type: string): Airport => {
	return type === 'departure' ? segment.depAirport : segment.arrAirport;
};

const getAirportsList = (flights: Flight[], type: string): Airport[] => {
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

export const getDepartureAirportsList = createSelector(
	[ getFlights ],
	(flights: Flight[]): Airport[] => getAirportsList(flights, 'departure')
);

export const getArrivalAirportsList = createSelector(
	[ getFlights ],
	(flights: Flight[]): Airport[] => getAirportsList(flights, 'arrival')
);
