import { Action } from 'redux';

export const FILTERS_TOGGLE_DIRECT_FLIGHTS = 'FILTERS_TOGGLE_DIRECT_FLIGHTS';
export const FILTERS_SET_DIRECT_FLIGHTS = 'FILTERS_SET_DIRECT_FLIGHTS';

export interface FilterDirectFlightAction extends Action {
	payload?: boolean;
}

export const toggleDirectFlights = (): FilterDirectFlightAction => {
	return {
		type: FILTERS_TOGGLE_DIRECT_FLIGHTS
	};
};

export const setDirectFlights = (isActive: boolean): FilterDirectFlightAction => {
	return {
		type: FILTERS_SET_DIRECT_FLIGHTS,
		payload: isActive
	};
};
