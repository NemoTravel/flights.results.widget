import { START_LOADING_FARE_FAMILIES, STOP_LOADING_FARE_FAMILIES } from './actions';
import { LegAction } from '../currentLeg/actions';

export interface FareFamiliesLoadingState {
	[legId: number]: boolean;
}

export const loadingFareFamiliesReducer = (state: FareFamiliesLoadingState = {}, action: LegAction): FareFamiliesLoadingState => {
	switch (action.type) {
		case START_LOADING_FARE_FAMILIES:
			return { ...state, [action.payload]: true };

		case STOP_LOADING_FARE_FAMILIES:
			return { ...state, [action.payload]: false };
	}

	return state;
};
