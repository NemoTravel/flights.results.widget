import { createSelector } from 'reselect';
import Airport from '../../../schemas/Airport';
import Flight from '../../../models/Flight';
import { ApplicationState, LocationType } from '../../../state';
import { createMap, getListOfSelectedCodes, ObjectsMap } from '../selectors';
import { getFlightsForCurrentLeg } from '../../flights/selectors';

/**
 * Get an array of departure airports codes used for filtering.
 *
 * @param {ApplicationState} state
 * @returns {string[]}
 */
export const getFilteredDepartureAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Departure];

/**
 * Get an array of arrival airports codes used for filtering.
 *
 * @param {ApplicationState} state
 * @returns {string[]}
 */
export const getFilteredArrivalAirports = (state: ApplicationState): string[] => state.filters.airports[LocationType.Arrival];

export const getSelectedDepartureAirportsList = createSelector([getFilteredDepartureAirports], getListOfSelectedCodes);
export const getSelectedArrivalAirportsList = createSelector([getFilteredArrivalAirports], getListOfSelectedCodes);

/**
 * Get an array of airports for departure and arrival locations.
 *
 * @param {Flight[]} flights
 * @param {LocationType} type
 * @returns {Airport[]}
 */
export const getAirports = (flights: Flight[], type: LocationType): Airport[] => {
	const airports: Airport[] = [];
	const airportsMap: { [IATA: string]: any } = {};

	flights.forEach(({ segments }) => {
		const segment = type === LocationType.Departure ? segments[0] : segments[segments.length - 1];
		const firstSegmentAirport = type === LocationType.Departure ? segment.depAirport : segment.arrAirport;

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

export const getDepartureAirports = createSelector([getFlightsForCurrentLeg], (flights: Flight[]): Airport[] => getAirports(flights, LocationType.Departure));
export const getArrivalAirports = createSelector([getFlightsForCurrentLeg], (flights: Flight[]): Airport[] => getAirports(flights, LocationType.Arrival));

/**
 * Map of `airportCode` => `airportObject`.
 */
export const getDepartureAirportsMap = createSelector(
	[getDepartureAirports],
	(airports: Airport[]): ObjectsMap<Airport> => {
		return createMap<Airport>(airports);
	}
);

/**
 * Map of `airportCode` => `airportObject`.
 */
export const getArrivalAirportsMap = createSelector(
	[getArrivalAirports],
	(airports: Airport[]): ObjectsMap<Airport> => {
		return createMap<Airport>(airports);
	}
);

/**
 * Get an array of departure airports selected in filters.
 */
export const getSelectedDepartureAirportsObjects = createSelector(
	[getDepartureAirportsMap, getFilteredDepartureAirports],
	(airportsMap: ObjectsMap<Airport>, airportsCodes: string[]): Airport[] => {
		return airportsCodes.map(code => airportsMap[code]);
	}
);

/**
 * Get an array of arrival airports selected in filters.
 */
export const getSelectedArrivalAirportsObjects = createSelector(
	[getArrivalAirportsMap, getFilteredArrivalAirports],
	(airportsMap: ObjectsMap<Airport>, airportsCodes: string[]): Airport[] => {
		return airportsCodes.map(code => airportsMap[code]);
	}
);
