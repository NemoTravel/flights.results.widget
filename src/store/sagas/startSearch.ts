import Flight from '../../models/Flight';
import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
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
import { getLocale } from '../config/selectors';
import { clearSelectedFlights } from '../selectedFlights/actions';
import { clearSelectedFamilies } from '../fareFamilies/selectedFamilies/actions';
import { clearCombinations } from '../fareFamilies/fareFamiliesCombinations/actions';
import { setRTMode } from '../fareFamilies/isRTMode/actions';
import { Action } from 'redux';
import { batchActions } from '../batching/actions';

const requestInfoIsValid = (info: RequestInfo): boolean => {
	return !info || !info.segments.find(segment => !segment.departure || !segment.arrival || !segment.departureDate);
};

const searchPayloadIsValid = (payload: SearchActionPayload): boolean => {
	if (!requestInfoIsValid(payload.RTRequest)) {
		return false;
	}

	return !payload.requests.find(request => !requestInfoIsValid(request));
};

function* runSearch(request: RequestInfo, index: number, locale: Language) {
	const flights: Flight[] = yield call(loadSearchResults, request, locale);

	flights.forEach(flight => flight.legId = index);

	yield put(addFlights(flights));
	yield put(setFlightsByLeg(flights, index));
}

function* runRTSearch(request: RequestInfo, locale: Language) {
	const flights: Flight[] = yield call(loadSearchResults, request, locale);

	yield put(addFlights(flights));
	yield put(addFlightsRT(flights));
}

function* runSearches(data: SearchActionPayload, locale: Language) {
	if (data.RTRequest) {
		// Run async round-trip search.
		yield fork(runRTSearch, data.RTRequest, locale);
	}

	// Split round-trip search into separate one-way searches.
	const numOfLegs = data.requests.length;

	for (let i = 0; i < numOfLegs; i++) {
		yield fork(runSearch, data.requests[i], i, locale);
	}
}

function* worker({ payload }: SearchAction) {
	const isLoading: boolean = yield select(getIsLoading);
	const locale: Language = yield select(getLocale);

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
			clearFlights()
		];

		// Reset all previously selected stuff.
		yield put(batchActions(...resetActions));

		// Run all searches.
		yield call(runSearches, payload, locale);

		// Stop loading animation.
		yield put(stopLoading());
	}
}

export default function* startSearchSaga() {
	yield takeEvery(START_SEARCH, worker);
}
