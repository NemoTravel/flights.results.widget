import { SearchInfoPassenger, SearchInfoSegment } from '@nemo.travel/search-widget';

export default interface RequestInfo {
	segments: SearchInfoSegment[];
	passengers: SearchInfoPassenger[];
	parameters: {
		serviceClass: string;
		delayed: boolean;
	}
}
