import { createSelector } from 'reselect';
import { ApplicationState, FareFamiliesLoadingState } from '../../state';

const getFareFamiliesLoadingState = (state: ApplicationState): FareFamiliesLoadingState => state.isLoadingFareFamilies;

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
