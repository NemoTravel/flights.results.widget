import { ADD_FLIGHTS_RT } from './actions';
import { FlightsAction } from '../flights/actions';
import Flight from '../../models/Flight';

export interface FlightsRTState {
	[flightUID: string]: Flight;
}

export const flightsRTReducer = (state: FlightsRTState = {}, action: FlightsAction): FlightsRTState => {
	switch (action.type) {
		case ADD_FLIGHTS_RT:
			const newFlightsPool: FlightsRTState = { ...state };

			action.payload.forEach(flight => {
				flight.isRT = true;
				newFlightsPool[flight.uid] = flight;
			});

			return newFlightsPool;
	}

	return state;
};
