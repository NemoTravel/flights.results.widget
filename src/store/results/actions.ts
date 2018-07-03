import { ResultsState } from './reducers';
import { trimSlashes } from '../../utils';

export const SET_RESULTS_INFO = 'SET_RESULTS_INFO';
export const ADD_RESULTS_INFO = 'ADD_RESULTS_INFO';
export const CLEAR_RESULTS_INFO = 'CLEAR_RESULTS_INFO';
export const LOAD_SEARCH_RESULTS = 'LOAD_SEARCH_RESULTS';

export type ResultsAction = ReturnType<typeof setResultsInfo>;

const createSearchResultsPayload = (pathname: string): ResultsState[] => {
	const parts = pathname.split('/').slice(2);
	const lastIndex = parts.length - 1;

	return parts.map((resultsId, index) => ({
		id: parseInt(trimSlashes(resultsId)),
		isRT: lastIndex === index
	}));
};

export const addResultsInfo = (info: ResultsState[]) => {
	return {
		type: ADD_RESULTS_INFO,
		payload: info
	};
};

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

export const loadSearchResults = (pathname: string) => {
	return {
		type: LOAD_SEARCH_RESULTS,
		payload: createSearchResultsPayload(pathname)
	};
};
