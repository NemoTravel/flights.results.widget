import { createSelector } from 'reselect';
import {
	ApplicationState, FareFamiliesAvailabilityState, FareFamiliesCombinationsState, FareFamiliesPricesState,
	SelectedFamiliesState
} from '../../state';
import FareFamily from '../../schemas/FareFamily';
import { Currency } from '../../enums';

export const getSelectedFamilies = (state: ApplicationState): SelectedFamiliesState => state.fareFamilies.selectedFamilies;
export const getFareFamiliesCombinations = (state: ApplicationState): FareFamiliesCombinationsState => state.fareFamilies.fareFamiliesCombinations;

export interface SelectedCombinations {
	[legId: number]: string;
}

export const getSelectedCombinations = createSelector(
	[getSelectedFamilies],
	(selectedFamilies: SelectedFamiliesState): SelectedCombinations => {
		const result: SelectedCombinations = {};

		for (const legId in selectedFamilies) {
			if (selectedFamilies.hasOwnProperty(legId)) {
				const legCombinationParts: string[] = [];
				const familiesBySegments = selectedFamilies[legId];

				for (const segmentId in familiesBySegments) {
					if (familiesBySegments.hasOwnProperty(segmentId)) {
						legCombinationParts.push(familiesBySegments[segmentId]);
					}
				}

				result[legId] = legCombinationParts.join('_');
			}
		}

		return result;
	}
);

export const combinationsAreValid = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: SelectedCombinations, combinations: FareFamiliesCombinationsState): boolean => {
		let result = true;

		if (Object.keys(combinations).length === Object.keys(selectedCombinations).length) {
			for (const legId in selectedCombinations) {
				if (selectedCombinations.hasOwnProperty(legId)) {
					const legCombinations = combinations[legId];

					if (!legCombinations.validCombinations.hasOwnProperty(selectedCombinations[legId])) {
						result = false;
						break;
					}
				}
			}
		}

		return result;
	}
);

/**
 * Get fare families availability.
 */
export const getFareFamiliesAvailability = createSelector(
	[getFareFamiliesCombinations],
	(combinationsByLegs: FareFamiliesCombinationsState): FareFamiliesAvailabilityState => {
		const result: FareFamiliesAvailabilityState = {};

		for (const legId in combinationsByLegs) {
			if (combinationsByLegs.hasOwnProperty(legId) && combinationsByLegs[legId]) {
				const combinations = combinationsByLegs[legId];

				if (!result.hasOwnProperty(legId)) {
					result[legId] = {};
				}

				for (const combination in combinations.validCombinations) {
					if (combinations.validCombinations.hasOwnProperty(combination)) {
						const combinationParts = combination.split('_');

						combinationParts.forEach((familyId, segmentId) => {
							if (!result[legId][segmentId]) {
								result[legId][segmentId] = {};
							}

							result[legId][segmentId][familyId] = true;
						});
					}
				}
			}
		}

		return result;
	}
);

/**
 * Get price differences for fare families.
 */
export const getFareFamiliesPrices = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations],
	(selectedCombinations: SelectedCombinations, combinationsByLegs: FareFamiliesCombinationsState): FareFamiliesPricesState => {
		const result: FareFamiliesPricesState = {};

		for (const legId in selectedCombinations) {
			if (selectedCombinations.hasOwnProperty(legId)) {
				const selectedLegCombination = selectedCombinations[legId];

				const
					dumbPrice = { amount: 0, currency: Currency.RUB },

					// Fare families combinations information on leg.
					combinations = combinationsByLegs[legId],

					// List of selected fare families grouped by segment id.
					selectedFamiliesBySegments = selectedLegCombination.split('_'),

					// List of fare families displayed on each segment.
					familiesBySegments = combinations.fareFamiliesBySegments,

					// Price of the current selected combination.
					currentPrice = combinations.combinationsPrices[selectedLegCombination] ? combinations.combinationsPrices[selectedLegCombination] : dumbPrice;

				if (!result.hasOwnProperty(legId)) {
					result[legId] = {};
				}

				for (const segmentKey in familiesBySegments) {
					if (familiesBySegments.hasOwnProperty(segmentKey)) {
						const segmentId = parseInt(segmentKey.replace('S', ''));

						if (!result[legId].hasOwnProperty(segmentId)) {
							result[legId][segmentId] = {};
						}

						// Loop through all families on segment and try to get the price of each family.
						familiesBySegments[segmentKey].forEach((family: FareFamily, index: number): void => {
							const familyKey = `F${index + 1}`;
							const newCombinationParts = [ ...selectedFamiliesBySegments ];

							// Replace family key on the segment with the new test one.
							newCombinationParts[segmentId] = familyKey;

							// Create new test combination.
							const newCombination = newCombinationParts.join('_');

							// Check if this test combination is valid and has it's own price.
							if (combinations.combinationsPrices.hasOwnProperty(newCombination)) {
								// Calculate difference between new test price and the current one.
								result[legId][segmentId][familyKey] = {
									amount: combinations.combinationsPrices[newCombination].amount - currentPrice.amount,
									currency: currentPrice.currency
								};
							}
						});
					}
				}
			}
		}

		return result;
	}
);
