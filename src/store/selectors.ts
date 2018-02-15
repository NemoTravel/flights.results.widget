import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import {
	getIsDirectOnly,
	getSelectedAirlinesList, getSelectedArrivalAirportsList,
	getSelectedDepartureAirportsList, ListOfSelectedCodes
} from './filters/selectors';
import { ApplicationState } from '../state';

const getFlights = (state: ApplicationState): Flight[] => state.flights;

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
