import { combineReducers } from 'redux';

import { ApplicationState } from '../state';
import { flightsByLegsReducer as flightsByLegs } from './flightsByLegs/reducers';
import { loadingReducer as isLoading } from './isLoading/reducers';
import { loadingFareFamiliesReducer as isLoadingFareFamilies } from './isLoadingFareFamilies/reducers';
import { configReducer as config } from './config/reducers';
import { filtersReducer as filters } from './filters/reducers';
import { currentLegReducer as currentLeg } from './currentLeg/reducers';
import { selectedFlightsReducer as selectedFlights } from './selectedFlights/reducers';
import { flightsReducer as flights } from './flights/reducers';
import { fareFamiliesReducer as fareFamilies } from './fareFamilies/reducers';
import { sortingReducer as sorting } from './sorting/reducers';
import { flightsRTReducer as flightsRT } from './flightsRT/reducers';
import { legsReducer as legs } from './legs/reducers';
import { showAllFlightsReducer as showAllFlights } from './showAllFlights/reducers';

export const rootReducer = combineReducers<ApplicationState>({
	isLoading,
	isLoadingFareFamilies,
	flights,
	flightsRT,
	flightsByLegs,
	filters,
	config,
	currentLeg,
	selectedFlights,
	fareFamilies,
	sorting,
	legs,
	showAllFlights
});
