import { Action } from 'redux';
import Flight from '../schemas/Flight';
import { Config } from '../main';

export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const SET_FLIGHTS = 'SET_FLIGHTS';
export const SET_CONFIG = 'SET_CONFIG';

export interface SetFlightsAction extends Action {
	payload: Flight[];
}

export interface SetConfigAction extends Action {
	payload: Config;
}

export const startLoading = (): Action => {
	return {
		type: START_LOADING
	};
};

export const stopLoading = (): Action => {
	return {
		type: STOP_LOADING
	};
};

export const setFlights = (flights: Flight[]): SetFlightsAction => {
	return {
		type: SET_FLIGHTS,
		payload: flights
	};
};

export const setConfig = (config: Config): SetConfigAction => {
	return {
		type: SET_CONFIG,
		payload: config
	};
};
