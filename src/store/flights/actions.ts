import Flight from '../../models/Flight';
import { Action } from 'redux';

export const ADD_FLIGHTS = 'ADD_FLIGHTS';
export const REMOVE_FLIGHTS = 'REMOVE_FLIGHTS';
export const CLEAR_FLIGHTS = 'CLEAR_FLIGHTS';

export interface FlightsAction extends Action {
	payload: Flight[];
}

export interface RemoveFlightsAction extends Action {
	payload: string[];
}

export const addFlights = (flights: Flight[]): FlightsAction => {
	return {
		type: ADD_FLIGHTS,
		payload: flights
	};
};

export const removeFlights = (flightsId: string[]): RemoveFlightsAction => {
	return {
		type: REMOVE_FLIGHTS,
		payload: flightsId
	};
};

export const clearFlights = (): Action => {
	return {
		type: CLEAR_FLIGHTS
	};
};
