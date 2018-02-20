import { Action } from 'redux';

export const SET_CURRENT_LEG = 'SET_CURRENT_LEG';

export interface CurrentLegAction extends Action {
	payload: number;
}

export const setCurrentLeg = (legId: number): CurrentLegAction => {
	return {
		type: SET_CURRENT_LEG,
		payload: legId
	};
};
