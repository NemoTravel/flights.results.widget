import { ActualizationProblem } from '../reducers';

export const ACTUALIZATION_SET_PROBLEM = 'ACTUALIZATION_SET_PROBLEM';

export type SetProblemAction = ReturnType<typeof setProblemType>;

export const setProblemType = (problem: ActualizationProblem) => {
	return {
		type: ACTUALIZATION_SET_PROBLEM,
		payload: {
			problem
		}
	};
};
