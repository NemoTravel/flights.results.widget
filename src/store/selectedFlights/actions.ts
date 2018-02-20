import { Action } from 'redux';

export const SET_SELECTED_FLIGHT = 'SET_SELECTED_FLIGHT';

export interface SelectedFlightAction extends Action {
	payload: {
		flightId: number;
		legId: number;
	};
}

export const addSelectedFlight = (flightId: number, legId: number): SelectedFlightAction => {
	return {
		type: SET_SELECTED_FLIGHT,
		payload: {
			flightId,
			legId
		}
	};
};
