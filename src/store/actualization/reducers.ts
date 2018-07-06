import { Action, combineReducers } from 'redux';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';
import { infoReducer as info } from './info/reducers';
import { problemReducer as problem } from './problem/reducers';
import { CLEAR_ACTUALIZATION_PROBLEMS } from './actions';

export enum ActualizationProblem {
	NoError = 'NoError',
	Price = 'Price',
	Availability = 'Availability',
	Unknown = 'Unknown'
}

export interface ActualizationState {
	info: AvailabilityInfo[];
	problem: ActualizationProblem;
}

export const actualizationReducer = (state: ActualizationState, action: Action): ActualizationState => {
	switch (action.type) {
		case CLEAR_ACTUALIZATION_PROBLEMS:
			return {
				info: [],
				problem: ActualizationProblem.NoError
			};
	}

	return combineReducers<ActualizationState>({
		info,
		problem
	})(state, action);
};
