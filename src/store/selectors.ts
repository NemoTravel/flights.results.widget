import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { getFlights, ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import { getSelectedArrivalTimeIntervals, getSelectedDepartureTimeIntervals } from './filters/time/selectors';
import { FlightTimeInterval } from '../state';
import { Moment } from 'moment';

const getTimeIntervalForDate = (date: Moment): FlightTimeInterval => {
	const hours = date.hours();
	const MORNING_TIME = 6;
	const NOON_TIME = 12;
	const EVENING_TIME = 18;
	let result: FlightTimeInterval;

	if (hours < MORNING_TIME) {
		result = FlightTimeInterval.Night;
	}
	else if (hours >= MORNING_TIME && hours < NOON_TIME) {
		result = FlightTimeInterval.Morning;
	}
	else if (hours >= NOON_TIME && hours < EVENING_TIME) {
		result = FlightTimeInterval.Afternoon;
	}
	else if (hours >= EVENING_TIME) {
		result = FlightTimeInterval.Evening;
	}

	return result;
};

/**
 * Get an array of flights after filtering.
 */
export const getVisibleFlights = createSelector(
	[
		getFlights,
		getSelectedAirlinesList,
		getSelectedDepartureAirportsList,
		getSelectedArrivalAirportsList,
		getSelectedDepartureTimeIntervals,
		getSelectedArrivalTimeIntervals,
		getIsDirectOnly
	],
	(
		flights: Flight[],
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean
	): Flight[] => {
		return flights.filter(flight => {
			const firstSegment = flight.segments[0];
			const lastSegment = flight.segments[flight.segments.length - 1];

			if (directOnly && flight.segments.length !== 1) {
				return false;
			}

			if (Object.keys(selectedDepartureAirports).length && !(firstSegment.depAirport.IATA in selectedDepartureAirports)) {
				return false;
			}

			if (Object.keys(selectedArrivalAirports).length && !(lastSegment.arrAirport.IATA in selectedArrivalAirports)) {
				return false;
			}

			if (Object.keys(selectedAirlines).length && !flight.segments.find(segment => segment.airline.IATA in selectedAirlines)) {
				return false;
			}

			if (Object.keys(selectedDepartureTimeIntervals).length && !(getTimeIntervalForDate(firstSegment.depDate) in selectedDepartureTimeIntervals)) {
				return false;
			}

			if (Object.keys(selectedArrivalTimeIntervals).length && !(getTimeIntervalForDate(lastSegment.arrDate) in selectedArrivalTimeIntervals)) {
				return false;
			}

			return true;
		});
	}
);
