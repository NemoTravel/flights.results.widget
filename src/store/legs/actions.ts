import { Action } from 'redux';
import Leg from '../../schemas/Leg';

export const SET_LEGS = 'SET_LEGS';

export interface LegsAction extends Action {
	payload: Leg[];
}

export const setLegs = (legs: Leg[]): LegsAction => {
	return {
		type: SET_LEGS,
		payload: legs
	};
};
