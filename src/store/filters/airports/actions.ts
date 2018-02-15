import { Action } from 'redux';
import { LocationType } from '../../../state';

export const FILTERS_ADD_AIRPORT = 'FILTERS_ADD_AIRPORT';
export const FILTERS_REMOVE_AIRPORT = 'FILTERS_REMOVE_AIRPORT';
export const FILTERS_REMOVE_ALL_AIRPORTS = 'FILTERS_REMOVE_ALL_AIRPORTS';

export interface FilterAirportsAction extends Action {
	payload: string;
	locationType: LocationType;
}

export const addAirport = (IATA: string, type: LocationType): FilterAirportsAction => {
	return {
		type: FILTERS_ADD_AIRPORT,
		locationType: type,
		payload: IATA
	};
};

export const removeAirport = (IATA: string, type: LocationType): FilterAirportsAction => {
	return {
		type: FILTERS_REMOVE_AIRPORT,
		locationType: type,
		payload: IATA
	};
};

export const removeAllAirports = (): Action => {
	return {
		type: FILTERS_REMOVE_ALL_AIRPORTS
	};
};
