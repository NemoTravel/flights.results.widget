import { ADD_FLIGHTS, CLEAR_FLIGHTS, FlightsAction } from './actions';
import Flight from '../../models/Flight';

export interface FlightsState {
	[flightId: string]: Flight;
}

export const flightsReducer = (state: FlightsState = {}, action: FlightsAction): FlightsState => {
	switch (action.type) {
		case CLEAR_FLIGHTS:
			return {};

		case ADD_FLIGHTS:
			const newFlightsPool: FlightsState = { ...state };

			action.payload.forEach(flight => newFlightsPool[flight.id] = flight);

			return newFlightsPool;
	}

	return state;
};
