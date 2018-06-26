import Money from './Money';
import FareFamily from './FareFamily';

interface CombinationsPrices {
	[combination: string]: Money;
}

interface CombinationsFlights {
	[combination: string]: string;
}

interface FareFamiliesMap {
	[fareFamilyId: string]: FareFamily;
}

export interface FareFamiliesBySegments {
	[segmentId: string]: FareFamily[];
}

export default interface FareFamiliesCombinations {
	initialCombination: string;
	combinationsPrices: CombinationsPrices;
	fareFamilies: FareFamiliesMap;
	fareFamiliesBySegments: FareFamiliesBySegments;
	validCombinations: CombinationsFlights;
}
