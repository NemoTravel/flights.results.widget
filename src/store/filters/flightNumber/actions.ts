import { Action } from 'redux';

export const SET_FLIGHT_NUMBER = 'SET_FLIGHT_NUMBER';

export interface FlightNumberAction extends Action {
	payload: string;
}

export const setFlightNumber = (number: string): FlightNumberAction => {
	return {
		type: SET_FLIGHT_NUMBER,
		payload: number
	};
};
