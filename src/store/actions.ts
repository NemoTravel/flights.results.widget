import * as moment from 'moment';
import Flight from '../schemas/Flight';
import { CommonThunkAction } from '../state';
import { setFlightsByLeg } from './flightsByLegs/actions';
import { startLoading, stopLoading } from './isLoading/actions';
import loadSearchResults from '../services/requests/results';
import loadFareFamilies from '../services/requests/fareFamilies';
import { addFlights } from './flights/actions';
import { setCombinations } from './alternativeFlights/fareFamiliesCombinations/actions';
import { setSelectedFamily } from './alternativeFlights/selectedFamilies/actions';
import { addFlightsRT } from './flightsRT/actions';
import RequestInfo from '../schemas/RequestInfo';
import { SearchInfo, SearchInfoSegment } from '@nemo.travel/search-widget';
import { ISO_DATE_LENGTH } from '../utils';
import { setLegs } from './legs/actions';
import Leg from '../schemas/Leg';

export const startSearch = (searchInfo: SearchInfo): CommonThunkAction => {
	return (dispatch): void => {
		dispatch(startLoading());

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

			loadSearchResults({ ...commonParams, segments: [ departureSegment, returnSegment ] }).then(results => dispatch(addFlightsRT(results)));
		}
		else {
			// OW and CR search
			requests = segments.map((segment: SearchInfoSegment): RequestInfo => ({
				...commonParams,
				segments: [ segment ]
			}));
		}

		dispatch(setLegs(requests.map((requestInfo: RequestInfo, index: number): Leg => {
			return {
				id: index,
				departure: requestInfo.segments[0].departure.IATA,
				arrival: requestInfo.segments[0].arrival.IATA,
				date: moment(requestInfo.segments[0].departureDate)
			};
		})));

		Promise
			.all(requests.map(loadSearchResults))
			.then(results => {
				results.forEach((flights: Flight[], index: number): void => {
					dispatch(addFlights(flights));
					dispatch(setFlightsByLeg(flights, index));
				});

				dispatch(stopLoading());
			}
		);
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
