import { Action } from 'redux';

export const FILTERS_ADD_AIRLINE = 'FILTERS_ADD_AIRLINE';
export const FILTERS_REMOVE_AIRLINE = 'FILTERS_REMOVE_AIRLINE';

export interface FilterAirlinesAction extends Action {
	payload: string;
}

export const addAirline = (IATA: string): FilterAirlinesAction => {
	return {
		type: FILTERS_ADD_AIRLINE,
		payload: IATA
	};
};

export const removeAirline = (IATA: string): FilterAirlinesAction => {
	return {
		type: FILTERS_REMOVE_AIRLINE,
		payload: IATA
	};
};
