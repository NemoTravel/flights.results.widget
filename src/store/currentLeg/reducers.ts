import { LegAction, NEXT_LEG, SET_LEG } from './actions';

export const currentLegReducer = (state: number = 0, action: LegAction): number => {
	switch (action.type) {
		case NEXT_LEG:
			return state + 1;

		case SET_LEG:
			return action.payload;
	}

	return state;
};
