import { Action } from 'redux';
import { CommonThunkAction } from '../../state';
import { setSelectedFlight } from '../selectedFlights/actions';

export const NEXT_LEG = 'NEXT_LEG';
export const SET_LEG = 'SET_LEG';

export interface LegAction extends Action {
	payload?: number;
}

export const nextLeg = (): LegAction => {
	return {
		type: NEXT_LEG
	};
};

export const goToLeg = (legId: number): CommonThunkAction => {
	return (dispatch, getState): void => {
		dispatch(setSelectedFlight(null, legId));
		dispatch(setLeg(legId));
	};
};

export const setLeg = (legId: number): LegAction => {
	return {
		type: SET_LEG,
		payload: legId
	};
};
