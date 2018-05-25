import { combineReducers } from 'redux';
import { airportsFilterReducer, AirportsFilterState } from './airports/reducers';
import { airlinesFilterReducer } from './airlines/reducers';
import { directOnlyFilterReducer } from './directOnly/reducers';
import { timeFilterReducer, TimeFilterState } from './time/reducers';
import { flightSearchReducer, FlightSearchState } from './flightSearch/reducers';
import { usableReducer } from './usable/reducers';

export interface FiltersState {
	airlines: string[];
	usable: boolean;
	directOnly: boolean;
	airports: AirportsFilterState;
	time: TimeFilterState;
	flightSearch: FlightSearchState
}

export const filtersReducer = combineReducers<FiltersState>({
	airlines: airlinesFilterReducer,
	airports: airportsFilterReducer,
	directOnly: directOnlyFilterReducer,
	usable: usableReducer,
	time: timeFilterReducer,
	flightSearch: flightSearchReducer
});
