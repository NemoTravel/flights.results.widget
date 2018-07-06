import {
	ADD_FLIGHT_BY_LEGS,
	AddFlightAction,
	CLEAR_FLIGHTS_BY_LEGS,
	SET_FLIGHTS_BY_LEGS,
	SetFlightsAction
} from './actions';

export interface FlightsByLegsState {
	[legId: number]: string[];
}

export const flightsByLegsReducer = (state: FlightsByLegsState = {}, action: SetFlightsAction|AddFlightAction): FlightsByLegsState => {
	switch (action.type) {
		case CLEAR_FLIGHTS_BY_LEGS:
			return {};

		case SET_FLIGHTS_BY_LEGS:
			const payload = (action as SetFlightsAction).payload;

			return {
				...state,
				[payload.legId]: payload.flights.map(flight => flight.id)
			};

		case ADD_FLIGHT_BY_LEGS:
			const { legId, flight } = (action as AddFlightAction).payload;

			return {
				...state,
				[legId]: [
					...state[legId],
					flight.id
				]
			};

	}

	return state;
};
