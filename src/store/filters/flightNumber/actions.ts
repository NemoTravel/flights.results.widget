import { Action } from 'redux';

export const FILTERS_SET_FLIGHT_NUMBER = 'FILTERS_SET_FLIGHT_NUMBER';
export const FILTERS_FLIGHT_NUMBER_TOGGLE = 'FILTERS_FLIGHT_NUMBER_TOGGLE';

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
		type: FILTERS_FLIGHT_NUMBER_TOGGLE
	};
};
