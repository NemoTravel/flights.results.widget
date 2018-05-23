import { Action } from 'redux';

export const FILTERS_SET_FLIGHT_SEARCH = 'FILTERS_SET_FLIGHT_SEARCH';
export const FILTERS_TOGGLE_FLIGHT_SEARCH = 'FILTERS_TOGGLE_FLIGHT_SEARCH';
export const FILTERS_REMOVE_FLIGHT_SEARCH = 'FILTERS_REMOVE_FLIGHT_SEARCH';

export interface FlightSearchAction extends Action {
	payload?: string;
}

export const setFlightSearch = (number: string): FlightSearchAction => {
	return {
		type: FILTERS_SET_FLIGHT_SEARCH,
		payload: number
	};
};

export const toggleFlightSearch = (): FlightSearchAction => {
	return {
		type: FILTERS_TOGGLE_FLIGHT_SEARCH
	};
};

export const removeFlightSearch = (): FlightSearchAction => {
	return {
		type: FILTERS_REMOVE_FLIGHT_SEARCH
	};
};
