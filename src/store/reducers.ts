import { combineReducers } from 'redux';

import { ApplicationState } from '../state';
import { flightsByLegsReducer } from './flightsByLegs/reducers';
import { loadingReducer } from './isLoading/reducers';
import { configReducer } from './config/reducers';
import { filtersReducer } from './filters/reducers';
import { currentLegReducer } from './currentLeg/reducers';
import { selectedFlightsReducer } from './selectedFlights/reducers';
import { flightsReducer } from './flights/reducers';
import { alternativeFlightsReducer } from './alternativeFlights/reducers';
import { sortingReducer } from './sorting/reducers';
import { flightsRTReducer } from './flightsRT/reducers';
import { legsReducer } from './legs/reducers';
import { showAllFlightsReducer } from './showAllFlights/reducers';

export const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flights: flightsReducer,
	flightsRT: flightsRTReducer,
	flightsByLegs: flightsByLegsReducer,
	filters: filtersReducer,
	config: configReducer,
	currentLeg: currentLegReducer,
	selectedFlights: selectedFlightsReducer,
	alternativeFlights: alternativeFlightsReducer,
	sorting: sortingReducer,
	legs: legsReducer,
	showAllFlights: showAllFlightsReducer
});
