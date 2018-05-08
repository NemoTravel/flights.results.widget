import { Action } from 'redux';

export const NEXT_LEG = 'NEXT_LEG';
export const SET_LEG = 'SET_LEG';
export const GO_TO_LEG = 'GO_TO_LEG';
export const GO_BACK = 'GO_BACK';

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

export const goToLeg = (legId: number): LegAction => {
	return {
		type: GO_TO_LEG,
		payload: legId
	};
};

export const goBack = (): LegAction => {
	return {
		type: GO_BACK
	};
};
