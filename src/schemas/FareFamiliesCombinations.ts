import Money from './Money';
import FareFamily from './FareFamily';
import FareFamilyFeature from './FareFamilyFeature';

export interface CombinationsPrices {
	[combination: string]: Money;
}

export interface CombinationsFlights {
	[combination: string]: string;
}

interface FareFamiliesMap {
	[fareFamilyId: string]: FareFamily;
}

export interface FareFamiliesBySegments {
	[segmentId: string]: FareFamily[];
}

export interface BaggageReplacementBySegments {
	[segmentId: number]: FareFamilyFeature;
}

export interface BaggageReplacement {
	[familyCode: string]: BaggageReplacementBySegments;
}

export default interface FareFamiliesCombinations {
	initialCombination: string;
	combinationsPrices: CombinationsPrices;
	fareFamilies: FareFamiliesMap;
	fareFamiliesBySegments: FareFamiliesBySegments;
	validCombinations: CombinationsFlights;
	baggageReplacement: BaggageReplacement;
}
