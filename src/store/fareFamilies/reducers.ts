import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';
import { fareFamiliesCombinationsReducer, FareFamiliesCombinationsState } from './fareFamiliesCombinations/reducers';
import { SelectedFamiliesState } from './selectedFamilies/reducers';

export interface FareFamiliesState {
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
}

export const fareFamiliesReducer = combineReducers<FareFamiliesState>({
	selectedFamilies: selectedFamiliesReducer,
	fareFamiliesCombinations: fareFamiliesCombinationsReducer
});
