import { FARE_FAMILIES_SET_RT_MODE, SetRTModeAction } from './actions';

export const setIsRTModeReducer = (state: boolean = false, action: SetRTModeAction): boolean => {
	switch (action.type) {
		case FARE_FAMILIES_SET_RT_MODE:
			return action.payload;
	}

	return state;
};
