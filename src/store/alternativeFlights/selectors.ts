import { createSelector } from 'reselect';
import { ApplicationState, FareFamiliesCombinationsState, SelectedFamiliesState } from '../../state';

export const getSelectedFamilies = (state: ApplicationState): SelectedFamiliesState => state.alternativeFlights.selectedFamilies;
export const getFareFamiliesCombinations = (state: ApplicationState): FareFamiliesCombinationsState => state.alternativeFlights.fareFamiliesCombinations;

export const getSelectedCombinations = createSelector(
	[getSelectedFamilies],
	(selectedFamilies: SelectedFamiliesState): string[] => {
		const result: string[] = [];

		for (const legId in selectedFamilies) {
			if (selectedFamilies.hasOwnProperty(legId)) {
				const legCombinationParts: string[] = [];
				const familiesBySegments = selectedFamilies[legId];

				for (const segmentId in familiesBySegments) {
					if (familiesBySegments.hasOwnProperty(segmentId)) {
						legCombinationParts.push(familiesBySegments[segmentId]);
					}
				}

				result.push(legCombinationParts.join('_'));
			}
		}

		return result;
	}
);
