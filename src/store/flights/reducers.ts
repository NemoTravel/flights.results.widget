import { FlightsState } from '../../state';
import { ADD_FLIGHTS, FlightsAction } from './actions';

export const flightsReducer = (state: FlightsState = {}, action: FlightsAction): FlightsState => {
	switch (action.type) {
		case ADD_FLIGHTS:
			const newFlightsPool: FlightsState = { ...state };

			action.payload.forEach(flight => newFlightsPool[flight.id] = flight);

			return newFlightsPool;
	}

	return state;
};
