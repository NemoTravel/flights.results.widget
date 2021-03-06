import FareFamilyFeature from './FareFamilyFeature';

export default interface FareFamily {
	isLoaded: boolean;
	fareFamilyName: string;
	segmentId: number;
	familyCode?: string;
	fareFeatures: {
		baggage: FareFamilyFeature[];
		exare: FareFamilyFeature[];
		misc: FareFamilyFeature[];
	}
}
