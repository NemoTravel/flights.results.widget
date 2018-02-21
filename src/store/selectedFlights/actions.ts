import { Action } from 'redux';
import { CommonThunkAction } from '../../state';
import { LEG_CHANGING_DELAY, nextLeg } from '../currentLeg/actions';
import { isLastLeg } from '../currentLeg/selectors';
import { startLoading, stopLoading } from '../isLoading/actions';

export const SET_SELECTED_FLIGHT = 'SET_SELECTED_FLIGHT';

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

export const selectFlight = (flightId: number, legId: number): CommonThunkAction => {
	return (dispatch, getState) => {
		const state = getState();

		dispatch(setSelectedFlight(flightId, legId));

		if (!isLastLeg(state)) {
			dispatch(nextLeg());
		}
	};
};
