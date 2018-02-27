import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';
import { AlternativeFlightsState } from '../../state';
import { fareFamiliesCombinationsReducer } from './fareFamiliesCombinations/reducers';

export const alternativeFlightsReducer = combineReducers<AlternativeFlightsState>({
	selectedFamilies: selectedFamiliesReducer,
	fareFamiliesCombinations: fareFamiliesCombinationsReducer
});
