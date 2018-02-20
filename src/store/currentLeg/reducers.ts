import { Action } from 'redux';
import { NEXT_LEG } from './actions';

export const currentLegReducer = (state: number = 0, action: Action): number => {
	switch (action.type) {
		case NEXT_LEG:
			return state + 1;
	}

	return state;
};
