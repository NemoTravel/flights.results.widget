import { combineReducers } from 'redux';
import { ApplicationState } from '../state';
import { flightsReducer } from './flights/reducers';
import { loadingReducer } from './isLoading/reducers';
import { configReducer } from './config/reducers';
import { filtersReducer } from './filters/reducers';
import { currentLegReducer } from './currentLeg/reducers';
import { selectedFlightsReducer } from './selectedFlights/reducers';

export const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flightsByLegs: flightsReducer,
	filters: filtersReducer,
	config: configReducer,
	currentLeg: currentLegReducer,
	selectedFligts: selectedFlightsReducer
});
