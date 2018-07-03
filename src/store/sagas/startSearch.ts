import Flight from '../../models/Flight';
import { Action } from 'redux';
import { all, call, CallEffect, put, select, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import RequestInfo from '../../schemas/RequestInfo';
import { startLoading, stopLoading } from '../isLoading/actions';
import { addFlightsRT } from '../flightsRT/actions';
import loadSearchResults from '../../services/requests/results';
import { setLegs } from '../legs/actions';
import { SearchAction, SearchActionPayload, START_SEARCH } from '../actions';
import { addFlights, clearFlights } from '../flights/actions';
import { clearFlightsByLegs, setFlightsByLeg } from '../flightsByLegs/actions';
import { goToLeg } from '../currentLeg/actions';
import { createLegs } from '../../utils';
import { getCurrentLegId } from '../currentLeg/selectors';
import { getIsLoading } from '../isLoading/selectors';
import { Language } from '../../enums';
import { getLocale, getNemoURL } from '../config/selectors';
import { clearSelectedFlights } from '../selectedFlights/actions';
import { clearSelectedFamilies } from '../fareFamilies/selectedFamilies/actions';
import { clearCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { setRTMode } from '../fareFamilies/isRTMode/actions';
import { batchActions } from '../batching/actions';
import { clearResultsInfo, setResultsInfo } from '../results/actions';
import { ResultsState } from '../results/reducers';

const requestInfoIsValid = (info: RequestInfo): boolean => {
	return !info || !info.segments.find(segment => !segment.departure || !segment.arrival || !segment.departureDate);
};

const searchPayloadIsValid = (payload: SearchActionPayload): boolean => {
	if (!requestInfoIsValid(payload.RTRequest)) {
		return false;
	}

	return !payload.requests.find(request => !requestInfoIsValid(request));
};

function* runSearch(request: RequestInfo, index: number, locale: Language, nemoURL: string) {
	const flights: Flight[] = yield call(loadSearchResults, request, locale, nemoURL);

	flights.forEach(flight => flight.legId = index);

	yield put(addFlights(flights));
	yield put(setFlightsByLeg(flights, index));

	return flights;
}

function* runRTSearch(request: RequestInfo, locale: Language, nemoURL: string) {
	const flights: Flight[] = yield call(loadSearchResults, request, locale, nemoURL);

	yield put(addFlights(flights));
	yield put(addFlightsRT(flights));

	return flights;
}

function* runSearches(data: SearchActionPayload, locale: Language, nemoURL: string) {
	const numOfLegs = data.requests.length;
	const requests: CallEffect[] = [];

	yield put(push('/results'));

	// Split round-trip search into separate one-way searches.
	for (let i = 0; i < numOfLegs; i++) {
		requests.push(call(runSearch, data.requests[i], i, locale, nemoURL));
	}

	// Run async round-trip search.
	if (data.RTRequest) {
		requests.push(call(runRTSearch, data.RTRequest, locale, nemoURL));
	}

	const flights: Flight[][] = yield all(requests);
	const numOfResults = flights.length;
	const results: ResultsState[] = [];
	const URL: string[] = [];

	for (let i = 0; i < numOfResults; i++) {
		if (flights[i].length) {
			const searchResultsId = flights[i][0].searchId;

			results.push({
				id: searchResultsId,
				isRT: numOfResults > 1 && i === numOfResults - 1
			});

			URL.push(searchResultsId.toString());
		}
	}

	yield put(setResultsInfo(results));
	yield put(push(`/results/${URL.join('/')}`));
}

function* worker({ payload }: SearchAction) {
	const isLoading: boolean = yield select(getIsLoading);
	const locale: Language = yield select(getLocale);
	const nemoURL: string = yield select(getNemoURL);

	if (!isLoading && searchPayloadIsValid(payload)) {
		// Launch loading animation.
		yield put(startLoading());

		// Create legs array.
		yield put(setLegs(createLegs(payload.requests)));

		// If current leg is not `0`, reset selected flights and legs.
		const currentLeg: number = yield select(getCurrentLegId);

		if (currentLeg) {
			yield put(goToLeg(0));
		}

		const resetActions: Action[] = [
			clearSelectedFamilies(),
			clearSelectedFlights(),
			clearCombinations(),
			setRTMode(false),
			clearFlightsByLegs(),
			clearFlights(),
			clearResultsInfo()
		];

		// Reset all previously selected stuff.
		yield put(batchActions(...resetActions));

		// Run all searches.
		yield call(runSearches, payload, locale, nemoURL);

		// Stop loading animation.
		yield put(stopLoading());
	}
}

export default function* startSearchSaga() {
	yield takeEvery(START_SEARCH, worker);
}
