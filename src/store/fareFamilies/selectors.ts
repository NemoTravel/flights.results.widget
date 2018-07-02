import { createSelector } from 'reselect';
import { FareFamiliesAvailability } from '../../schemas/FareFamiliesAvailability';
import FareFamily from '../../schemas/FareFamily';
import { Currency } from '../../enums';
import { RootState } from '../reducers';
import { FareFamiliesCombinationsState } from './fareFamiliesCombinations/reducers';
import { SelectedFamiliesState } from './selectedFamilies/reducers';
import { FareFamiliesPrices } from '../../schemas/FareFamiliesPrices';
import { getIsRTMode } from './isRTMode/selectors';
import { CombinationsFlights } from '../../schemas/FareFamiliesCombinations';

export const getSelectedFamilies = (state: RootState): SelectedFamiliesState => state.fareFamilies.selectedFamilies;
export const getFareFamiliesCombinations = (state: RootState): FareFamiliesCombinationsState => state.fareFamilies.fareFamiliesCombinations;

export interface SelectedCombinations {
	[legId: number]: string;
}

/**
 * Merge selected families on segments.
 */
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

/**
 * Get flight ids after selection of fare families.
 */
export const getResultingFlightIds = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations, getIsRTMode],
	(selectedCombinations: SelectedCombinations, combinationsInfo: FareFamiliesCombinationsState, isRTMode: boolean): string[] => {
		const result: string[] = [];
		const combinationsParts: string[] = [];
		let validCombinationsInfo: CombinationsFlights;

		for (const legId in selectedCombinations) {
			if (selectedCombinations.hasOwnProperty(legId) && combinationsInfo.hasOwnProperty(legId)) {
				if (isRTMode) {
					if (!validCombinationsInfo) {
						validCombinationsInfo = combinationsInfo[legId].validCombinations;
					}

					combinationsParts.push(selectedCombinations[legId]);
				}
				else {
					const selectedCombination = selectedCombinations[legId];
					const validCombinations = combinationsInfo[legId].validCombinations;

					if (validCombinations.hasOwnProperty(selectedCombination)) {
						result.push(validCombinations[selectedCombination]);
					}
				}
			}
		}

		if (isRTMode) {
			const resultingCombination = combinationsParts.join('_');

			if (validCombinationsInfo && validCombinationsInfo.hasOwnProperty(resultingCombination)) {
				result.push(validCombinationsInfo[resultingCombination]);
			}
		}

		return result;
	}
);

/**
 * Check if selected combination is valid.
 */
export const combinationsAreValid = createSelector(
	[getSelectedCombinations, getFareFamiliesCombinations, getIsRTMode],
	(selectedCombinations: SelectedCombinations, combinationsByLegs: FareFamiliesCombinationsState, isRTMode: boolean): boolean => {
		let result = true;

		if (Object.keys(combinationsByLegs).length === Object.keys(selectedCombinations).length && Object.keys(combinationsByLegs).length > 0) {
			// If we're choosing fare families for RT flight, do a quick check.
			if (isRTMode) {
				const selectedCombinationParts: string[] = [];
				const validCombinations = combinationsByLegs[0].validCombinations;

				for (const legId in selectedCombinations) {
					if (selectedCombinations.hasOwnProperty(legId)) {
						selectedCombinationParts.push(selectedCombinations[legId]);
					}
				}

				if (!validCombinations.hasOwnProperty(selectedCombinationParts.join('_'))) {
					result = false;
				}
			}
			else {
				for (const legId in selectedCombinations) {
					if (selectedCombinations.hasOwnProperty(legId)) {
						const legCombinations = combinationsByLegs[legId];

						if (!legCombinations.validCombinations.hasOwnProperty(selectedCombinations[legId])) {
							result = false;
							break;
						}
					}
				}
			}
		}

		return result;
	}
);

/**
 * List of visible families.
 */
export const getFareFamiliesAvailability = createSelector(
	[getFareFamiliesCombinations],
	(combinationsByLegs: FareFamiliesCombinationsState): FareFamiliesAvailability => {
		const result: FareFamiliesAvailability = {};

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
	(selectedCombinations: SelectedCombinations, combinationsByLegs: FareFamiliesCombinationsState): FareFamiliesPrices => {
		const result: FareFamiliesPrices = {};

		for (const legId in selectedCombinations) {
			if (selectedCombinations.hasOwnProperty(legId) && combinationsByLegs.hasOwnProperty(legId) && combinationsByLegs[legId]) {
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
						const familiesOnSegment = familiesBySegments[segmentKey];
						const segmentId = parseInt(segmentKey.replace('S', ''));

						if (!result[legId].hasOwnProperty(segmentId)) {
							result[legId][segmentId] = {};
						}

						// Loop through all families on segment and try to get the price of each family.
						familiesOnSegment.forEach((family: FareFamily, index: number): void => {
							const familyKey = `F${index + 1}`;
							const newCombinationParts = [...selectedFamiliesBySegments];

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
