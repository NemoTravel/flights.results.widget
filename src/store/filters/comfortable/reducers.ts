import { Action } from 'redux';
import { FILTERS_REMOVE_COMFORTABLE, FILTERS_TOGGLE_COMFORTABLE } from './actions';

export const comfortableFilterReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_COMFORTABLE:
			return !state;
		case FILTERS_REMOVE_COMFORTABLE:
			return false;
	}

	return state;
};
