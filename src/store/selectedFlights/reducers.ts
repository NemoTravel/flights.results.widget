import { SET_SELECTED_FLIGHT, SelectedFlightAction } from './actions';
import { SelectedFlightsState } from '../../state';

const initialState: SelectedFlightsState = {};

export const selectedFlightsReducer = (state: SelectedFlightsState = initialState, action: SelectedFlightAction): SelectedFlightsState => {
	switch (action.type) {
		case SET_SELECTED_FLIGHT:
			return {
				...state,
				[action.payload.legId]: action.payload.flightId
			};
	}

	return state;
};
