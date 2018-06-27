import { Action } from 'redux';
import { START_LOADING_ACTUALIZATION, STOP_LOADING_ACTUALIZATION } from './actions';

export const loadingActualizationReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case START_LOADING_ACTUALIZATION:
			return true;

		case STOP_LOADING_ACTUALIZATION:
			return false;
	}

	return state;
};
