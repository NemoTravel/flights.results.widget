import { Action } from 'redux';

export const SHOW_ALL_FLIGHTS = 'SHOW_ALL_FLIGHTS';

export const showAllFlights = (): Action => {
	return {
		type: SHOW_ALL_FLIGHTS
	};
};
