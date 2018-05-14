import { SET_SELECTED_FLIGHT, SelectedFlightAction } from './actions';
import { SelectedFlightsState } from '../../state';

const initialState: SelectedFlightsState = {};

export const selectedFlightsReducer = (state: SelectedFlightsState = initialState, action: SelectedFlightAction): SelectedFlightsState => {
	switch (action.type) {
		case SET_SELECTED_FLIGHT:
			const flight = action.payload.flight;
			const legId = action.payload.legId;

			if (flight === null) {
				const result: SelectedFlightsState = {};

				for (const tmpLegId in state) {
					if (state.hasOwnProperty(tmpLegId) && tmpLegId !== legId.toString()) {
						result[tmpLegId] = state[tmpLegId];
					}
				}

				return result;
			}
			else {
				return {
					...state,
					[legId]: flight
				};
			}
	}

	return state;
};
