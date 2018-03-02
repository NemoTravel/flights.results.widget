import { FilterDirectFlightAction, FILTERS_SET_DIRECT_FLIGHTS, FILTERS_TOGGLE_DIRECT_FLIGHTS } from './actions';

export const directOnlyFilterReducer = (state: boolean = false, action: FilterDirectFlightAction): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_DIRECT_FLIGHTS:
			return !state;

		case FILTERS_SET_DIRECT_FLIGHTS:
			return action.payload;
	}

	return state;
};
