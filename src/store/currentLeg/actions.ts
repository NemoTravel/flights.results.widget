import { Action } from 'redux';

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

export const setLeg = (legId: number): LegAction => {
	return {
		type: SET_LEG,
		payload: legId
	};
};
