import { combineReducers } from 'redux';
import { airportsFilterReducer, AirportsFilterState } from './airports/reducers';
import { airlinesFilterReducer } from './airlines/reducers';
import { directOnlyFilterReducer } from './directOnly/reducers';
import { timeFilterReducer, TimeFilterState } from './time/reducers';
import { flightNumberReducer } from './flightNumber/reducers';

export interface FiltersState {
	airlines: string[];
	directOnly: boolean;
	airports: AirportsFilterState;
	time: TimeFilterState;
	flightNumber: string
}

export const filtersReducer = combineReducers<FiltersState>({
	airlines: airlinesFilterReducer,
	airports: airportsFilterReducer,
	directOnly: directOnlyFilterReducer,
	time: timeFilterReducer,
	flightNumber: flightNumberReducer
});
