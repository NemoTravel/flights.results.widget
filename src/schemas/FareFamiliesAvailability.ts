export interface FareFamiliesAvailability {
	[legId: number]: {
		[segmentId: number]: {
			[familyId: string]: boolean;
		};
	};
}
