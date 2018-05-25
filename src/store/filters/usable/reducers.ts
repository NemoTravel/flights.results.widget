import { Action } from 'redux';
import { FILTERS_TOGGLE_USABLE } from './actions';

export const usableReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_USABLE:
			return !state;
	}

	return state;
};
