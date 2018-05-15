import { Action } from 'redux';
import { START_LOADING_FARE_FAMILIES, STOP_LOADING_FARE_FAMILIES } from './actions';

export const loadingFareFamiliesReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case START_LOADING_FARE_FAMILIES:
			return true;

		case STOP_LOADING_FARE_FAMILIES:
			return false;
	}

	return state;
};
