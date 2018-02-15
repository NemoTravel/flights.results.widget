import { Action, combineReducers } from 'redux';
import { FILTERS_TOGGLE_DIRECT_FLIGHTS } from './actions';
import { FiltersState } from '../../state';
import { airportsFilterReducer } from './airports/reducers';
import { airlinesFilterReducer } from './airlines/reducers';

const directOnlyFilterReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_DIRECT_FLIGHTS:
			return !state;
	}

	return state;
};

export const filtersReducer = combineReducers<FiltersState>({
	airlines: airlinesFilterReducer,
	airports: airportsFilterReducer,
	directOnly: directOnlyFilterReducer
});
