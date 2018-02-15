import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { getFlights, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';

/**
 * Get an array of flights after filtering.
 */
export const getVisibleFlights = createSelector(
	[
		getFlights,
		getSelectedAirlinesList,
		getSelectedDepartureAirportsList,
		getSelectedArrivalAirportsList,
		getIsDirectOnly
	],
	(flights: Flight[], selectedAirlines: ListOfSelectedCodes, selectedDepartureAirports: ListOfSelectedCodes, selectedArrivalAirports: ListOfSelectedCodes, directOnly: boolean): Flight[] => {
		return flights.filter(flight => {
			if (directOnly && flight.segments.length !== 1) {
				return false;
			}

			if (Object.keys(selectedDepartureAirports).length && !(flight.segments[0].depAirport.IATA in selectedDepartureAirports)) {
				return false;
			}

			if (Object.keys(selectedArrivalAirports).length && !(flight.segments[flight.segments.length - 1].arrAirport.IATA in selectedArrivalAirports)) {
				return false;
			}

			if (Object.keys(selectedAirlines).length && !flight.segments.find(segment => segment.airline.IATA in selectedAirlines)) {
				return false;
			}

			return true;
		});
	}
);
