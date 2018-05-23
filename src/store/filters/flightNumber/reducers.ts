import { FlightNumberAction, FILTERS_SET_FLIGHT_NUMBER, FILTERS_TOGGLE_FLIGHT_NUMBER, FILTERS_REMOVE_FLIGHT_NUMBER } from './actions';

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
	if (action.type === FILTERS_TOGGLE_FLIGHT_NUMBER) {
		return { ...state, isActive: !state.isActive };
	}
	if (action.type === FILTERS_REMOVE_FLIGHT_NUMBER) {
		return { ...state, ...initialFlightNumber };
	}

	return state;
};
