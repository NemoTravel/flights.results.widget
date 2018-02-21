import { Action } from 'redux';
import { CommonThunkAction } from '../../state';
import { setSelectedFlight } from '../selectedFlights/actions';

export const NEXT_LEG = 'NEXT_LEG';
export const SET_LEG = 'SET_LEG';

export const LEG_CHANGING_DELAY = 500;

export interface LegAction extends Action {
	payload?: number;
}

export const nextLeg = (): LegAction => {
	return {
		type: NEXT_LEG
	};
};

export const setLeg = (legId: number): LegAction => {
	return {
		type: SET_LEG,
		payload: legId
	};
};

export const goToLeg = (legId: number): CommonThunkAction => {
	return (dispatch): void => {
		dispatch(setSelectedFlight(null, legId));
		dispatch(setLeg(legId));
	};
};
