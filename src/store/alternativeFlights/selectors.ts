import { createSelector } from 'reselect';
import {
	ApplicationState, FareFamiliesCombinationsState, FareFamiliesPricesState,
	SelectedFamiliesState
} from '../../state';
import FareFamily from '../../schemas/FareFamily';

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

export const combinationsAreValid = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: string[], combinations: FareFamiliesCombinationsState): boolean => {
		let result = false;

		if (Object.keys(combinations).length === selectedCombinations.length) {
			result = !selectedCombinations.find((combination, index): boolean => {
				const legCombinations = combinations[index];

				return !legCombinations.validCombinations.hasOwnProperty(combination);
			});
		}

		return result;
	}
);

export const getFareFamiliesPrices =  createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: string[], combinations: FareFamiliesCombinationsState): FareFamiliesPricesState => {
		const result: FareFamiliesPricesState = {};

		if (Object.keys(combinations).length === selectedCombinations.length) {
			selectedCombinations.forEach((selectedLegCombination, legId): void => {
				const legCombinations = combinations[legId];
				const selectedFamiliesBySegments = selectedLegCombination.split('_');
				const familiesBySegments = legCombinations.fareFamiliesBySegments;
				let currentPrice = legCombinations.combinationsPrices[selectedLegCombination];

				currentPrice = currentPrice || { amount: 0, currency: 'RUB' };

				if (!result.hasOwnProperty(legId)) {
					result[legId] = {};
				}

				for (const segmentKey in familiesBySegments) {
					if (familiesBySegments.hasOwnProperty(segmentKey)) {
						const segmentId = parseInt(segmentKey.replace('S', ''));

						if (!result[legId].hasOwnProperty(segmentId)) {
							result[legId][segmentId] = {};
						}

						familiesBySegments[segmentKey].forEach((family: FareFamily, index: number) => {
							const familyKey = `F${index + 1}`;
							const newCombinationParts = [ ...selectedFamiliesBySegments ];
							newCombinationParts[segmentId] = familyKey;
							const newCombination = newCombinationParts.join('_');

							if (legCombinations.combinationsPrices.hasOwnProperty(newCombination)) {
								result[legId][segmentId][familyKey] = {
									amount: legCombinations.combinationsPrices[newCombination].amount - currentPrice.amount,
									currency: currentPrice.currency
								};
							}
						});
					}
				}
			});
		}

		return result;
	}
);
