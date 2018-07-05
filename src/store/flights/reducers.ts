import { ADD_FLIGHTS, CLEAR_FLIGHTS, FlightsAction, REMOVE_FLIGHTS, RemoveFlightsAction } from './actions';
import Flight from '../../models/Flight';

export interface FlightsState {
	[flightId: string]: Flight;
}

export const flightsReducer = (state: FlightsState = {}, action: FlightsAction|RemoveFlightsAction): FlightsState => {
	switch (action.type) {
		case CLEAR_FLIGHTS:
			return {};

		case ADD_FLIGHTS:
			const newFlightsPool: FlightsState = { ...state };

			(action as FlightsAction).payload.forEach(flight => newFlightsPool[flight.id] = flight);

			return newFlightsPool;

		case REMOVE_FLIGHTS:
			const removeMap: { [flightId: string]: boolean } = {};
			const result: FlightsState = {};

			(action as RemoveFlightsAction).payload.forEach(flightId => removeMap[flightId] = true);

			for (const flightId in state) {
				if (state.hasOwnProperty(flightId) && !removeMap.hasOwnProperty(flightId)) {
					result[flightId] = state[flightId];
				}
			}

			return result;
	}

	return state;
};
