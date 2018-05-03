import Flight from '../../models/Flight';
import { FlightsAction } from '../flights/actions';

export const ADD_FLIGHTS_RT = 'ADD_FLIGHTS_RT';

export const addFlightsRT = (flights: Flight[]): FlightsAction => {
	return {
		type: ADD_FLIGHTS_RT,
		payload: flights
	};
};
