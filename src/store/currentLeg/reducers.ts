import { CurrentLegAction, SET_CURRENT_LEG } from './actions';

export const currentLegReducer = (state: number = 0, action: CurrentLegAction): number => {
	switch (action.type) {
		case SET_CURRENT_LEG:
			return action.payload;
	}

	return state;
};
