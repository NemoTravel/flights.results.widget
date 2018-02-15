import { Action } from 'redux';
import { FILTERS_TOGGLE_DIRECT_FLIGHTS } from './actions';

export const directOnlyFilterReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_DIRECT_FLIGHTS:
			return !state;
	}

	return state;
};
