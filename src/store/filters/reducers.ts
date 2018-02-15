import { Action, combineReducers } from 'redux';
import {
	FilterAirlinesAction, FilterAirportsAction, FILTERS_ADD_AIRLINE, FILTERS_ADD_AIRPORT, FILTERS_REMOVE_AIRLINE,
	FILTERS_REMOVE_AIRPORT, FILTERS_REMOVE_ALL_AIRLINES, FILTERS_REMOVE_ALL_AIRPORTS,
	FILTERS_TOGGLE_DIRECT_FLIGHTS
} from './actions';
import { AirportsFilterState, FiltersState, LocationType } from '../../state';

const initialAirportsFiltersState: AirportsFilterState = {
	[LocationType.Departure]: [],
	[LocationType.Arrival]: []
};

const addCodeInList = (list: string[], code: string): string[] => {
	const result: string[] = [...list];

	if (!list.find(existingCode => existingCode === code)) {
		result.push(code);
	}

	return result;
};

const removeCodeFromList = (list: string[], code: string): string[] => {
	return list.filter(existingCode => existingCode !== code);
};

const airportsCodesListReducer = (state: string[], action: FilterAirportsAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_AIRPORT:
			return addCodeInList(state, action.payload);

		case FILTERS_REMOVE_AIRPORT:
			return removeCodeFromList(state, action.payload);
	}

	return state;
};

const airlinesFilterReducer = (state: string[] = [], action: FilterAirlinesAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_AIRLINE:
			return addCodeInList(state, action.payload);

		case FILTERS_REMOVE_AIRLINE:
			return removeCodeFromList(state, action.payload);

		case FILTERS_REMOVE_ALL_AIRLINES:
			return [];
	}

	return state;
};

const airportsFilterReducer = (state: AirportsFilterState = initialAirportsFiltersState, action: FilterAirportsAction): AirportsFilterState => {
	switch (action.type) {
		case FILTERS_REMOVE_ALL_AIRPORTS:
			return { ...state, departure: [], arrival: []};
	}

	return { ...state, [action.locationType]: airportsCodesListReducer(state[action.locationType], action) };
};

const directOnlyFilterReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_DIRECT_FLIGHTS:
			return !state;
	}

	return state;
};

export const filtersReducer = combineReducers<FiltersState>({
	airlines: airlinesFilterReducer,
	directOnly: directOnlyFilterReducer,
	airports: airportsFilterReducer
});
