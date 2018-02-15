import { Action } from 'redux';

export const FILTERS_ADD_AIRLINE = 'FILTERS_ADD_AIRLINE';
export const FILTERS_REMOVE_AIRLINE = 'FILTERS_REMOVE_AIRLINE';
export const FILTERS_REMOVE_ALL_AIRLINES = 'FILTERS_REMOVE_ALL_AIRLINES';

export interface FilterAirlinesAction extends Action {
	payload: string;
}

/**
 * Add airline code to the list of airlines codes used for filtering.
 *
 * @param {string} IATA
 * @returns {FilterAirlinesAction}
 */
export const addAirline = (IATA: string): FilterAirlinesAction => {
	return {
		type: FILTERS_ADD_AIRLINE,
		payload: IATA
	};
};

/**
 * Remove airline code from the list of airlines codes used for filtering.
 *
 * @param {string} IATA
 * @returns {FilterAirlinesAction}
 */
export const removeAirline = (IATA: string): FilterAirlinesAction => {
	return {
		type: FILTERS_REMOVE_AIRLINE,
		payload: IATA
	};
};

/**
 * Clear the list of airlines codes used for filtering.
 *
 * @returns {Action}
 */
export const removeAllAirlines = (): Action => {
	return {
		type: FILTERS_REMOVE_ALL_AIRLINES
	};
};
