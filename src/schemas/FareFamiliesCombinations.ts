import Money from './Money';
import FareFamily from './FareFamily';

interface CombinationsPrices {
	[combination: string]: Money;
}

interface CombinationsFlights {
	[combination: string]: number;
}

interface FareFamiliesMap {
	[fareFamilyId: string]: FareFamily;
}

interface FareFamiliesBySegments {
	[segmentId: string]: FareFamily[];
}

export default interface FareFamiliesCombinations {
	initialCombination: string;
	combinationsPrices: CombinationsPrices;
	fareFamilies: FareFamiliesMap;
	fareFamiliesBySegments: FareFamiliesBySegments;
	validCombinations: CombinationsFlights;
}
