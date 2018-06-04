import { combineReducers } from 'redux';
import { selectedFamiliesReducer } from './selectedFamilies/reducers';
import { fareFamiliesCombinationsReducer, FareFamiliesCombinationsState } from './fareFamiliesCombinations/reducers';
import { SelectedFamiliesState } from './selectedFamilies/reducers';
import { setIsRTModeReducer } from './isRTMode/reducers';

export interface FareFamiliesState {
	selectedFamilies: SelectedFamiliesState;
	fareFamiliesCombinations: FareFamiliesCombinationsState;
	isRTMode: boolean;
}

export const fareFamiliesReducer = combineReducers<FareFamiliesState>({
	selectedFamilies: selectedFamiliesReducer,
	fareFamiliesCombinations: fareFamiliesCombinationsReducer,
	isRTMode: setIsRTModeReducer
});
