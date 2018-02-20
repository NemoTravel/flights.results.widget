import { SET_SELECTED_FLIGHT, SelectedFlightAction } from './actions';
import { SelectedFlightsState } from '../../state';

export const selectedFlightsReducer = (state: SelectedFlightsState = {}, action: SelectedFlightAction): SelectedFlightsState => {
	switch (action.type) {
		case SET_SELECTED_FLIGHT:
			return {
				...state,
				[action.payload.legId]: action.payload.flightId
			};
	}

	return state;
};
