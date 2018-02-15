import { Action } from 'redux';
import { LocationType } from '../../main';

export const FILTERS_TOGGLE_DIRECT_FLIGHTS = 'FILTERS_TOGGLE_DIRECT_FLIGHTS';
export const FILTERS_ADD_AIRLINE = 'FILTERS_ADD_AIRLINE';
export const FILTERS_REMOVE_AIRLINE = 'FILTERS_REMOVE_AIRLINE';
export const FILTERS_ADD_AIRPORT = 'FILTERS_ADD_AIRPORT';
export const FILTERS_REMOVE_AIRPORT = 'FILTERS_REMOVE_AIRPORT';

export interface FilterAirlinesAction extends Action {
	payload: string;
}

export interface FilterAirportsAction extends Action {
	payload: string;
	locationType: LocationType;
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

export const toggleDirectFlights = (): Action => {
	return {
		type: FILTERS_TOGGLE_DIRECT_FLIGHTS
	};
};
