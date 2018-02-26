import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';

export const alternativeFlightsReducer = combineReducers({
	selectedFamilies: selectedFamiliesReducer
});
