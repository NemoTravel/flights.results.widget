import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';
import { FareFamiliesState } from '../../state';
import { fareFamiliesCombinationsReducer } from './fareFamiliesCombinations/reducers';

export const fareFamiliesReducer = combineReducers<FareFamiliesState>({
	selectedFamilies: selectedFamiliesReducer,
	fareFamiliesCombinations: fareFamiliesCombinationsReducer
});
