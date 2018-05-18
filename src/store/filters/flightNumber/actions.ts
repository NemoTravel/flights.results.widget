import { Action } from 'redux';

export const FILTERS_SET_FLIGHT_NUMBER = 'FILTERS_SET_FLIGHT_NUMBER';

export interface FlightNumberAction extends Action {
	payload: string;
}

export const setFlightNumber = (number: string): FlightNumberAction => {
	return {
		type: FILTERS_SET_FLIGHT_NUMBER,
		payload: number
	};
};
