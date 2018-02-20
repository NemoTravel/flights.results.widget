import Flight from '../../schemas/Flight';
import { Action } from 'redux';

export const SET_FLIGHTS = 'SET_FLIGHTS';

export interface SetFlightsAction extends Action {
	payload: {
		flights: Flight[];
		legId: number;
	};
}

export const setFlights = (flights: Flight[], legId: number): SetFlightsAction => {
	return {
		type: SET_FLIGHTS,
		payload: {
			flights,
			legId
		}
	};
};
