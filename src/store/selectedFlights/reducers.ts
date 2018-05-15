import { SelectedFlightAction, SET_SELECTED_FLIGHT } from './actions';
import SelectedFlight from '../../schemas/SelectedFlight';

export interface SelectedFlightsState {
	[legId: number]: SelectedFlight;
}

export const selectedFlightsReducer = (state: SelectedFlightsState = {}, action: SelectedFlightAction): SelectedFlightsState => {
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
