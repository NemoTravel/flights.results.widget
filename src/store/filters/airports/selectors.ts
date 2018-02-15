import { createSelector } from 'reselect';
import Airport from '../../../schemas/Airport';
import Flight from '../../../schemas/Flight';
import { ApplicationState, LocationType } from '../../../state';
import { createMap, getFlights, getListOfSelectedCodes, ObjectsMap } from '../selectors';

export const getFilteredDepartureAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Departure];
export const getFilteredArrivalAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Arrival];

export const getSelectedDepartureAirportsList = createSelector([getFilteredDepartureAirports], getListOfSelectedCodes);
export const getSelectedArrivalAirportsList = createSelector([getFilteredArrivalAirports], getListOfSelectedCodes);

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

export const getDepartureAirportsMap = createSelector(
	[getDepartureAirportsList],
	(airports: Airport[]): ObjectsMap<Airport> => {
		return createMap<Airport>(airports);
	}
);

export const getArrivalAirportsMap = createSelector(
	[getArrivalAirportsList],
	(airports: Airport[]): ObjectsMap<Airport> => {
		return createMap<Airport>(airports);
	}
);

export const getSelectedDepartureAirportsObjects = createSelector(
	[getDepartureAirportsMap, getFilteredDepartureAirports],
	(airportsMap: ObjectsMap<Airport>, airportsCodes: string[]): Airport[] => {
		return airportsCodes.map(code => airportsMap[code]);
	}
);

export const getSelectedArrivalAirportsObjects = createSelector(
	[getArrivalAirportsMap, getFilteredArrivalAirports],
	(airportsMap: ObjectsMap<Airport>, airportsCodes: string[]): Airport[] => {
		return airportsCodes.map(code => airportsMap[code]);
	}
);
