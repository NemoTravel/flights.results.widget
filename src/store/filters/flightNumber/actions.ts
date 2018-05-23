import { Action } from 'redux';

export const FILTERS_SET_FLIGHT_NUMBER = 'FILTERS_SET_FLIGHT_NUMBER';
export const FILTERS_TOGGLE_FLIGHT_NUMBER = 'FILTERS_TOGGLE_FLIGHT_NUMBER';
export const FILTERS_REMOVE_FLIGHT_NUMBER = 'FILTERS_REMOVE_FLIGHT_NUMBER';

export interface FlightNumberAction extends Action {
	payload?: string;
}

export const setFlightNumber = (number: string): FlightNumberAction => {
	return {
		type: FILTERS_SET_FLIGHT_NUMBER,
		payload: number
	};
};

export const toggleFlightNumber = (): FlightNumberAction => {
	return {
		type: FILTERS_TOGGLE_FLIGHT_NUMBER
	};
};

export const removeFlightNumber = (): FlightNumberAction => {
	return {
		type: FILTERS_REMOVE_FLIGHT_NUMBER
	};
};
