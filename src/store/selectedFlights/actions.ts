import { Action } from 'redux';

export const SET_SELECTED_FLIGHT = 'SET_SELECTED_FLIGHT';
export const SELECT_FLIGHT = 'SELECT_FLIGHT';

export interface SelectedFlightAction extends Action {
	payload: {
		flightId: number;
		legId: number;
	};
}

export const setSelectedFlight = (flightId: number, legId: number): SelectedFlightAction => {
	return {
		type: SET_SELECTED_FLIGHT,
		payload: {
			flightId,
			legId
		}
	};
};

export const selectFlight = (flightId: number, legId: number): SelectedFlightAction => {
	return {
		type: SELECT_FLIGHT,
		payload: {
			flightId,
			legId
		}
	};
};
