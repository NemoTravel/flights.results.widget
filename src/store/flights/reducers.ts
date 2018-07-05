import { ADD_FLIGHTS, CLEAR_FLIGHTS, FlightsAction, REMOVE_FLIGHTS } from './actions';
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

		case REMOVE_FLIGHTS:
			const removeMap: FlightsState = {};
			const result: FlightsState = {};

			action.payload.forEach(flight => removeMap[flight.id] = flight);

			for (const flightId in state) {
				if (state.hasOwnProperty(flightId) && !removeMap.hasOwnProperty(flightId)) {
					result[flightId] = state[flightId];
				}
			}

			return result;
	}

	return state;
};
