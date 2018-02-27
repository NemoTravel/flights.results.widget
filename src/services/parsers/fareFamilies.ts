import * as APIParser from '@nemo.travel/api-parser';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';

export const parse = (response: APIParser.Response, parentFlightId: number): FareFamiliesCombinations => {
	let result: FareFamiliesCombinations;
	const objects = APIParser(response);
	const responseInfo = objects[`flight/fareFamilies/${parentFlightId}`];

	if (responseInfo) {
		result = {
			initialCombination: responseInfo['initialCombination'],
			combinationsPrices: responseInfo['combinationsPrices'],
			fareFamilies: responseInfo['fareFamilies'],
			fareFamiliesBySegments: responseInfo['fareFamiliesBySegments'],
			validCombinations: responseInfo['validCombinations']
		};
	}

	return result;
};
