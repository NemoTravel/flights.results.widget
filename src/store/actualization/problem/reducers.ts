import { ActualizationProblem } from '../reducers';
import { ACTUALIZATION_SET_PROBLEM, SetProblemAction } from './actions';

export const problemReducer = (state: ActualizationProblem, action: SetProblemAction): ActualizationProblem => {
	switch (action.type) {
		case ACTUALIZATION_SET_PROBLEM:
			return action.payload.problem;
	}

	return state;
};
