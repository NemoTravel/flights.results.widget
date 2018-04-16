import Leg from '../../schemas/Leg';
import { LegsAction, SET_LEGS } from './actions';

export const legsReducer = (state: Leg[] = [], action: LegsAction): Leg[] => {
	switch (action.type) {
		case SET_LEGS:
			return action.payload;
	}

	return state;
};
