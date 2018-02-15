import Flight from '../../schemas/Flight';
import { Action } from 'redux';

export const SET_FLIGHTS = 'SET_FLIGHTS';

export interface SetFlightsAction extends Action {
	payload: Flight[];
}

export const setFlights = (flights: Flight[]): SetFlightsAction => {
	return {
		type: SET_FLIGHTS,
		payload: flights
	};
};
