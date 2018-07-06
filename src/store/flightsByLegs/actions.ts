import Flight from '../../models/Flight';
import { Action } from 'redux';

export const SET_FLIGHTS_BY_LEGS = 'SET_FLIGHTS_BY_LEGS';
export const ADD_FLIGHT_BY_LEGS = 'ADD_FLIGHT_BY_LEGS';
export const CLEAR_FLIGHTS_BY_LEGS = 'CLEAR_FLIGHTS_BY_LEGS';

export interface SetFlightsAction extends Action {
	payload: {
		flights: Flight[];
		legId: number;
	};
}

export interface AddFlightAction extends Action {
	payload: {
		flight: Flight;
		legId: number;
	};
}

export const addFlightByLeg = (flight: Flight, legId: number): AddFlightAction => {
	return {
		type: ADD_FLIGHT_BY_LEGS,
		payload: {
			flight,
			legId
		}
	};
};

export const setFlightsByLeg = (flights: Flight[], legId: number): SetFlightsAction => {
	return {
		type: SET_FLIGHTS_BY_LEGS,
		payload: {
			flights,
			legId
		}
	};
};

export const clearFlightsByLegs = (): Action => {
	return {
		type: CLEAR_FLIGHTS_BY_LEGS
	};
};
