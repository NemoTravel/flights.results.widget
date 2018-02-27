import FareFamilyFeature from './FareFamilyFeature';

export default interface FareFamily {
	isLoaded: boolean;
	name: string;
	segmentId: number;
	fareFeatures: {
		baggage: FareFamilyFeature[];
		exare: FareFamilyFeature[];
		misc: FareFamilyFeature[];
	}
}
