import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { getListOfSelectedCodes } from '../selectors';
import { Moment } from 'moment';
import { FlightTimeInterval, LocationType } from '../../../enums';
import { TimeFilterState } from './reducers';
import Flight from '../../../models/Flight';
import { getFlightsForCurrentLeg } from '../../flights/selectors';

export const getTimeIntervalForDate = (date: Moment): FlightTimeInterval => {
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

export const getTimeIntervalName = (interval: FlightTimeInterval): string => {
	switch (interval) {
		case FlightTimeInterval.Afternoon:
			return 'Днём';

		case FlightTimeInterval.Morning:
			return 'Утром';

		case FlightTimeInterval.Evening:
			return 'Вечером';

		case FlightTimeInterval.Night:
			return 'Ночью';
	}
};

export const getTimeIntervals = (flights: Flight[]): TimeFilterState => {
	const timeIntervals: TimeFilterState = {
		[LocationType.Arrival]: [],
		[LocationType.Departure]: []
	};

	flights.forEach(flight => {
		const departureTime = getTimeIntervalForDate(flight.firstSegment.depDate),
			arrivalTime = getTimeIntervalForDate(flight.lastSegment.arrDate);

		if (timeIntervals[LocationType.Arrival].indexOf(arrivalTime) === -1) {
			timeIntervals[LocationType.Arrival].push(arrivalTime);
		}
		if (timeIntervals[LocationType.Departure].indexOf(departureTime) === -1) {
			timeIntervals[LocationType.Departure].push(departureTime);
		}
	});

	return timeIntervals;
};

export const getAllTimeIntervals = createSelector([getFlightsForCurrentLeg], getTimeIntervals);

export const getFilteredDepartureTimeIntervals = (state: RootState): FlightTimeInterval[] => state.filters.time[LocationType.Departure];
export const getFilteredArrivalTimeIntervals = (state: RootState): FlightTimeInterval[] => state.filters.time[LocationType.Arrival];

export const getSelectedDepartureTimeIntervals = createSelector([getFilteredDepartureTimeIntervals], getListOfSelectedCodes);
export const getSelectedArrivalTimeIntervals = createSelector([getFilteredArrivalTimeIntervals], getListOfSelectedCodes);
