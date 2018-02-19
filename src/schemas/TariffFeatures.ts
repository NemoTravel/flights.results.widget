import TariffFeature from './TariffFeature';

export default interface TariffFeatures {
	isLoaded: boolean;
	fareFamilyName: string;
	segmentId: number;
	fareFeatures: {
		baggage: TariffFeature[];
		exare: TariffFeature[];
		misc: TariffFeature[];
	}
}
