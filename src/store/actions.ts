import { Action } from 'redux';
import Flight from '../schemas/Flight';

export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const SET_FLIGHTS = 'SET_FLIGHTS';

export interface SetFlightsAction extends Action {
	payload: Flight[];
}

export const startLoading = (): Action => {
	return {
		type: START_LOADING
	};
};

export const stopLoading = (): Action => {
	return {
		type: STOP_LOADING
	};
};

export const setFlights = (flights: Flight[]): SetFlightsAction => {
	return {
		type: SET_FLIGHTS,
		payload: flights
	};
};
