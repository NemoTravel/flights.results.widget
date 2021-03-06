import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { Moment } from 'moment';
import { FlightTimeInterval, LocationType } from '../../../enums';
import { TimeFilterState } from './reducers';
import Flight from '../../../models/Flight';
import { getFlightsForCurrentLeg } from '../../flights/selectors';
import { i18n } from '../../../i18n';

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
			return i18n('filters-quick-time-interval_day');

		case FlightTimeInterval.Morning:
			return i18n('filters-quick-time-interval_morning');

		case FlightTimeInterval.Evening:
			return i18n('filters-quick-time-interval_evening');

		case FlightTimeInterval.Night:
			return i18n('filters-quick-time-interval_night');
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
