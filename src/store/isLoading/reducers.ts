import { Action } from 'redux';
import { START_LOADING, STOP_LOADING } from './actions';

export const loadingReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case START_LOADING:
			return true;

		case STOP_LOADING:
			return false;
	}

	return state;
};
