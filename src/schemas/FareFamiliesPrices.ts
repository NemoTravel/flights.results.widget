import Money from './Money';

export interface FareFamiliesPrices {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: Money;
		};
	};
}
