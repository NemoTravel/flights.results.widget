import { Action } from 'redux';
import { FILTERS_REMOVE_USABLE, FILTERS_TOGGLE_USABLE } from './actions';

export const usableReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_USABLE:
			return !state;
		case FILTERS_REMOVE_USABLE:
			return false;
	}

	return state;
};
