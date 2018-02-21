import { SET_FLIGHTS_BY_LEGS, SetFlightsAction } from './actions';
import { FlightsByLegsState } from '../../state';

export const flightsByLegsReducer = (state: FlightsByLegsState = {}, action: SetFlightsAction): FlightsByLegsState => {
	switch (action.type) {
		case SET_FLIGHTS_BY_LEGS:
			return {
				...state,
				[action.payload.legId]: action.payload.flights
			};
	}

	return state;
};
