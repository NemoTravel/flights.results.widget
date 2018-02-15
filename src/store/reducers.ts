import { combineReducers } from 'redux';
import { ApplicationState } from '../state';
import { flightsReducer } from './flights/reducers';
import { loadingReducer } from './isLoading/reducers';
import { configReducer } from './config/reducers';
import { filtersReducer } from './filters/reducers';

export const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flights: flightsReducer,
	filters: filtersReducer,
	config: configReducer
});
