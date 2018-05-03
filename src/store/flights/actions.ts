import Flight from '../../models/Flight';
import { Action } from 'redux';

export const ADD_FLIGHTS = 'ADD_FLIGHTS';

export interface FlightsAction extends Action {
	payload: Flight[];
}

export const addFlights = (flights: Flight[]): FlightsAction => {
	return {
		type: ADD_FLIGHTS,
		payload: flights
	};
};
