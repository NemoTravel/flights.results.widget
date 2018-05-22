import { FlightNumberAction, FILTERS_SET_FLIGHT_NUMBER, FILTERS_FLIGHT_NUMBER_TOGGLE } from './actions';

export interface FlightNumberState {
	search: string;
	isActive: boolean;
}

const initialFlightNumber: FlightNumberState = {
	search: '',
	isActive: false
};

export const flightNumberReducer = (state: FlightNumberState = initialFlightNumber, action: FlightNumberAction): FlightNumberState => {
	if (action.type === FILTERS_SET_FLIGHT_NUMBER) {
		return { ...state, search: action.payload };
	}
	if (action.type === FILTERS_FLIGHT_NUMBER_TOGGLE) {
		return { ...state, isActive: !state.isActive };
	}

	return state;
};
