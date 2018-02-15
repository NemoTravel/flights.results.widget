import { Action } from 'redux';

export const FILTERS_TOGGLE_DIRECT_FLIGHTS = 'FILTERS_TOGGLE_DIRECT_FLIGHTS';

export const toggleDirectFlights = (): Action => {
	return {
		type: FILTERS_TOGGLE_DIRECT_FLIGHTS
	};
};
