import { Action } from 'redux';

export const NEXT_LEG = 'NEXT_LEG';

export const nextLeg = (): Action => {
	return {
		type: NEXT_LEG
	};
};
