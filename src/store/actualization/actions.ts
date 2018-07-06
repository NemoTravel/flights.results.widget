import { Action } from 'redux';

export const CLEAR_ACTUALIZATION_PROBLEMS = 'CLEAR_ACTUALIZATION_PROBLEMS';

export const clearActualizationProblems = (): Action => {
	return {
		type: CLEAR_ACTUALIZATION_PROBLEMS
	};
};
