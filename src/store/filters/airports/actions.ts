import { Action } from 'redux';
import { LocationType } from '../../../state';

export const FILTERS_ADD_AIRPORT = 'FILTERS_ADD_AIRPORT';
export const FILTERS_REMOVE_AIRPORT = 'FILTERS_REMOVE_AIRPORT';
export const FILTERS_REMOVE_ALL_AIRPORTS = 'FILTERS_REMOVE_ALL_AIRPORTS';

export interface FilterAirportsAction extends Action {
	payload: string;
	locationType: LocationType;
}

/**
 * Add airport code to the list of airports codes used for filtering.
 *
 * @param {string} IATA
 * @param {LocationType} type
 * @returns {FilterAirportsAction}
 */
export const addAirport = (IATA: string, type: LocationType): FilterAirportsAction => {
	return {
		type: FILTERS_ADD_AIRPORT,
		locationType: type,
		payload: IATA
	};
};

/**
 * Remove airport code from the list of airports codes used for filtering.
 *
 * @param {string} IATA
 * @param {LocationType} type
 * @returns {FilterAirportsAction}
 */
export const removeAirport = (IATA: string, type: LocationType): FilterAirportsAction => {
	return {
		type: FILTERS_REMOVE_AIRPORT,
		locationType: type,
		payload: IATA
	};
};

/**
 * Clear the list of airports codes used for filtering.
 *
 * @returns {Action}
 */
export const removeAllAirports = (): Action => {
	return {
		type: FILTERS_REMOVE_ALL_AIRPORTS
	};
};
