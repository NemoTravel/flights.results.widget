import { ADD_FLIGHTS, FlightsAction } from './actions';
import Flight from '../../models/Flight';

export interface FlightsState {
	[flightId: number]: Flight;
}

export const flightsReducer = (state: FlightsState = {}, action: FlightsAction): FlightsState => {
	switch (action.type) {
		case ADD_FLIGHTS:
			const newFlightsPool: FlightsState = { ...state };

			action.payload.forEach(flight => newFlightsPool[flight.id] = flight);

			return newFlightsPool;
	}

	return state;
};
