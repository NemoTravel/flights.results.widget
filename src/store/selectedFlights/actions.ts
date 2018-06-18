import { Action } from 'redux';
import SelectedFlight from '../../schemas/SelectedFlight';

export const SET_SELECTED_FLIGHT = 'SET_SELECTED_FLIGHT';
export const SELECT_FLIGHT = 'SELECT_FLIGHT';

export interface SelectedFlightAction extends Action {
	payload: {
		flight: SelectedFlight;
		legId: number;
	};
}

export const setSelectedFlight = (legId: number, flight: SelectedFlight): SelectedFlightAction => {
	return {
		type: SET_SELECTED_FLIGHT,
		payload: {
			flight,
			legId
		}
	};
};

export const selectFlight = (flight: SelectedFlight, legId: number): SelectedFlightAction => {
	return {
		type: SELECT_FLIGHT,
		payload: {
			flight,
			legId
		}
	};
};
