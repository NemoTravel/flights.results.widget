import { createSelector } from 'reselect';
import Flight from '../schemas/Flight';
import { ListOfSelectedCodes } from './filters/selectors';
import { getSelectedAirlinesList } from './filters/airlines/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from './filters/airports/selectors';
import { getIsDirectOnly } from './filters/directOnly/selectors';
import { getSelectedArrivalTimeIntervals, getSelectedDepartureTimeIntervals, getTimeIntervalForDate } from './filters/time/selectors';
import { getFlights } from './flights/selectors';
import { getCurrentSorting, priceCompareFunction } from './sorting/selectors';
import { SortingDirection, SortingState, SortingType } from '../state';

const sortingFunctionsMap: { [type: string]: (a: Flight, b: Flight, direction: SortingDirection) => number } = {
	[SortingType.Price]: priceCompareFunction
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
		getIsDirectOnly,
		getCurrentSorting
	],
	(
		flights: Flight[],
		selectedAirlines: ListOfSelectedCodes,
		selectedDepartureAirports: ListOfSelectedCodes,
		selectedArrivalAirports: ListOfSelectedCodes,
		selectedDepartureTimeIntervals: ListOfSelectedCodes,
		selectedArrivalTimeIntervals: ListOfSelectedCodes,
		directOnly: boolean,
		sorting: SortingState
	): Flight[] => {
		let newFlights = flights.filter(flight => {
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

		newFlights = newFlights.sort((a, b) => {
			return sortingFunctionsMap[sorting.type](a, b, sorting.direction);
		});

		return newFlights;
	}
);
