import { combineReducers } from 'redux';
import { FiltersState } from '../../state';
import { airportsFilterReducer } from './airports/reducers';
import { airlinesFilterReducer } from './airlines/reducers';
import { directOnlyFilterReducer } from './directOnly/reducers';
import { timeFilterReducer } from './time/reducers';

export const filtersReducer = combineReducers<FiltersState>({
	airlines: airlinesFilterReducer,
	airports: airportsFilterReducer,
	directOnly: directOnlyFilterReducer,
	time: timeFilterReducer
});
