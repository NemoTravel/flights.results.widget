import { FlightNumberAction, SET_FLIGHT_NUMBER } from './actions';

export const flightNumberReducer = (state: string = '', action: FlightNumberAction): string => {
	if (action.type === SET_FLIGHT_NUMBER) {
		return action.payload;
	}

	return state;
};
