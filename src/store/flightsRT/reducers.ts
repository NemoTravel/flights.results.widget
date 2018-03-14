import { FlightsRTState } from '../../state';
import { ADD_FLIGHTS_RT } from './actions';
import { FlightsAction } from '../flights/actions';

export const flightsRTReducer = (state: FlightsRTState = {}, action: FlightsAction): FlightsRTState => {
	switch (action.type) {
		case ADD_FLIGHTS_RT:
			const newFlightsPool: FlightsRTState = { ...state };

			action.payload.forEach(flight => newFlightsPool[flight.uid] = flight);

			return newFlightsPool;
	}

	return state;
};
