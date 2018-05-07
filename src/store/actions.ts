import { CommonThunkAction } from '../state';
import { startLoading, stopLoading } from './isLoading/actions';
import loadFareFamilies from '../services/requests/fareFamilies';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';
import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';
import { Action } from 'redux';
import { ISO_DATE_LENGTH } from '../utils';
import RequestInfo from '../schemas/RequestInfo';

export const START_SEARCH = 'START_SEARCH';

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

export const searchForAlternativeFlights = (): CommonThunkAction => {
	return (dispatch, getState): void => {
		const state = getState();
		const selectedFlights = state.selectedFlights;
		const flightIds: number[] = [];

		dispatch(startLoading());

		for (const legId in selectedFlights) {
			if (selectedFlights.hasOwnProperty(legId)) {
				flightIds.push(selectedFlights[legId]);
			}
		}

		Promise
			.all(flightIds.map(loadFareFamilies))
			.then(results => {
				results.forEach((combinations, legId) => {
					dispatch(setCombinations(legId, combinations));
					const combination = combinations ? combinations.initialCombination.split('_') : [];
					combination.forEach((familyId, segmentId) => dispatch(setSelectedFamily(legId, segmentId, familyId)));
				});

				dispatch(stopLoading());
			});
	};
};
