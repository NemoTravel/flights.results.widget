import { createSelector } from 'reselect';
import { FareFamiliesLoadingState } from './reducers';
import { RootState } from '../reducers';

const getFareFamiliesLoadingState = (state: RootState): FareFamiliesLoadingState => state.isLoadingFareFamilies;

export const isLoadingFareFamilies = createSelector(
	[getFareFamiliesLoadingState],
	(state: FareFamiliesLoadingState): boolean => {
		let result = false;

		for (const legId in state) {
			if (state.hasOwnProperty(legId) && state[legId] === true) {
				result = true;
				break;
			}
		}

		return result;
	}
);
