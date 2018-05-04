import { Action } from 'redux';
import { SHOW_ALL_FLIGHTS } from './actions';

export const showAllFlightsReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case SHOW_ALL_FLIGHTS:
			return true;
	}

	return state;
};
