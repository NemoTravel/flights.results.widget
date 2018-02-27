import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';
import { AlternativeFlightsState } from '../../state';

export const alternativeFlightsReducer = combineReducers<AlternativeFlightsState>({
	selectedFamilies: selectedFamiliesReducer
});
