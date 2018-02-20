import { SET_FLIGHTS, SetFlightsAction } from './actions';
import { FlightsByLegsState } from '../../state';

export const flightsReducer = (state: FlightsByLegsState = {}, action: SetFlightsAction): FlightsByLegsState => {
	switch (action.type) {
		case SET_FLIGHTS:
			return {
				...state,
				[action.payload.legId]: action.payload.flights
			};
	}

	return state;
};
