import { Action } from 'redux';

export const FILTERS_TOGGLE_DIRECT_FLIGHTS = 'FILTERS_TOGGLE_DIRECT_FLIGHTS';
export const FILTERS_ADD_AIRLINE = 'FILTERS_ADD_AIRLINE';
export const FILTERS_REMOVE_AIRLINE = 'FILTERS_REMOVE_AIRLINE';
export const FILTERS_ADD_DEPARTURE_AIRPORT = 'FILTERS_ADD_DEPARTURE_AIRPORT';
export const FILTERS_REMOVE_DEPARTURE_AIRPORT = 'FILTERS_REMOVE_DEPARTURE_AIRPORT';
export const FILTERS_ADD_ARRIVAL_AIRPORT = 'FILTERS_ADD_ARRIVAL_AIRPORT';
export const FILTERS_REMOVE_ARRIVAL_AIRPORT = 'FILTERS_REMOVE_ARRIVAL_AIRPORT';

export interface FilterAirlinesAction extends Action {
	payload: string;
}

export interface FilterAirportsAction extends Action {
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

export const addDepartureAirport = (IATA: string): FilterAirportsAction => {
	return {
		type: FILTERS_ADD_DEPARTURE_AIRPORT,
		payload: IATA
	};
};

export const removeDepartureAirport = (IATA: string): FilterAirportsAction => {
	return {
		type: FILTERS_REMOVE_DEPARTURE_AIRPORT,
		payload: IATA
	};
};

export const addArrivalAirport = (IATA: string): FilterAirportsAction => {
	return {
		type: FILTERS_ADD_ARRIVAL_AIRPORT,
		payload: IATA
	};
};

export const removeArrivalAirport = (IATA: string): FilterAirportsAction => {
	return {
		type: FILTERS_REMOVE_ARRIVAL_AIRPORT,
		payload: IATA
	};
};

export const toggleDirectFlights = (): Action => {
	return {
		type: FILTERS_TOGGLE_DIRECT_FLIGHTS
	};
};
