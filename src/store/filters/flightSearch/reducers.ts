import { FlightSearchAction, FILTERS_SET_FLIGHT_SEARCH, FILTERS_TOGGLE_FLIGHT_SEARCH, FILTERS_REMOVE_FLIGHT_SEARCH } from './actions';

export interface FlightSearchState {
	search: string;
	isActive: boolean;
}

const initialFlightSearch: FlightSearchState = {
	search: '',
	isActive: false
};

export const flightSearchReducer = (state: FlightSearchState = initialFlightSearch, action: FlightSearchAction): FlightSearchState => {
	switch (action.type) {
		case FILTERS_SET_FLIGHT_SEARCH:
			return { ...state, search: action.payload };

		case FILTERS_TOGGLE_FLIGHT_SEARCH:
			return { ...state, isActive: !state.isActive };

		case FILTERS_REMOVE_FLIGHT_SEARCH:
			return { ...state, ...initialFlightSearch };
	}

	return state;
};
