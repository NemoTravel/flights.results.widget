import { CLEAR_RESULTS_INFO, ResultsAction, SET_RESULTS_INFO } from './actions';

export interface ResultsState {
	id: number;
	isRT?: boolean;
}

export const resultsReducer = (state: ResultsState[] = [], action: ResultsAction): ResultsState[] => {
	switch (action.type) {
		case SET_RESULTS_INFO:
			return action.payload;

		case CLEAR_RESULTS_INFO:
			return [];
	}

	return state;
};
