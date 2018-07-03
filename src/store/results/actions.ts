import { ResultsState } from './reducers';

export const SET_RESULTS_INFO = 'SET_RESULTS_INFO';
export const CLEAR_RESULTS_INFO = 'CLEAR_RESULTS_INFO';

export type ResultsAction = ReturnType<typeof setResultsInfo>;

export const setResultsInfo = (info: ResultsState[]) => {
	return {
		type: SET_RESULTS_INFO,
		payload: info
	};
};

export const clearResultsInfo = () => {
	return {
		type: CLEAR_RESULTS_INFO
	};
};
