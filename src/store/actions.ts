import { CommonThunkAction } from '../state';
import { startLoading, stopLoading } from './isLoading/actions';
import { setCombinations } from './fareFamilies/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './fareFamilies/selectedFamilies/actions';
import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';
import { Action } from 'redux';
import { ISO_DATE_LENGTH } from '../utils';
import RequestInfo from '../schemas/RequestInfo';

export const START_SEARCH = 'START_SEARCH';
export const SEARCH_FARE_FAMILIES = 'SEARCH_FARE_FAMILIES';

export interface SearchActionPayload {
	requests: RequestInfo[];
	RTRequest: RequestInfo;
}

export interface SearchAction extends Action {
	payload: SearchActionPayload;
}

const createSearchPayload = (searchInfo: SearchInfo): SearchActionPayload => {
	let RTRequest: RequestInfo = null;
	let requests: RequestInfo[] = [];

	const segments = searchInfo.segments.map(segment => {
		segment.departureDate = segment.departureDate.substr(0, ISO_DATE_LENGTH);
		segment.returnDate = segment.returnDate.substr(0, ISO_DATE_LENGTH);

		return segment;
	});

	const commonParams = {
		passengers: searchInfo.passengers,
		parameters: {
			delayed: false,
			serviceClass: searchInfo.serviceClass
		}
	};

	if (segments.length === 1 && segments[0].returnDate) {
		// RT search
		const segment = segments[0];
		const departureSegment: SearchInfoSegment = { departure: segment.departure, arrival: segment.arrival, departureDate: segment.departureDate };
		const returnSegment: SearchInfoSegment = { departure: segment.arrival, arrival: segment.departure, departureDate: segment.returnDate };

		requests.push({ ...commonParams, segments: [ departureSegment ] });
		requests.push({ ...commonParams, segments: [ returnSegment ] });

		RTRequest = { ...commonParams, segments: [ departureSegment, returnSegment ] };
	}
	else {
		// OW and CR search
		requests = segments.map((segment: SearchInfoSegment): RequestInfo => ({
			...commonParams,
			segments: [ segment ]
		}));
	}

	return {
		requests,
		RTRequest
	};
};

export const startSearch = (searchInfo: SearchInfo): SearchAction => {
	return {
		type: START_SEARCH,
		payload: createSearchPayload(searchInfo)
	};
};

export const searchFareFamilies = (): Action => {
	return {
		type: SEARCH_FARE_FAMILIES
	};
};
