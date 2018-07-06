import { all, call, CallEffect, put, select, takeEvery } from 'redux-saga/effects';
import { clearResultsInfo, LOAD_SEARCH_RESULTS, ResultsAction } from '../actions';
import { getIsLoading } from '../../isLoading/selectors';
import { startLoading, stopLoading } from '../../isLoading/actions';
import loadSearchInfo from '../../../services/requests/searchInfo';
import { Language } from '../../../enums';
import { getLocale, getNemoURL } from '../../config/selectors';
import { SearchInfo } from '@nemo.travel/search-widget';
import { createLegs, trimSlashes } from '../../../utils';
import { setLegs } from '../../legs/actions';
import { createSearchPayload } from '../../actions';
import { getCurrentLegId } from '../../currentLeg/selectors';
import { goToLeg } from '../../currentLeg/actions';
import { clearSelectedFlights } from '../../selectedFlights/actions';
import { Action } from 'redux';
import { clearCombinations } from '../../fareFamilies/fareFamiliesCombinations/actions';
import { clearFlightsByLegs, setFlightsByLeg } from '../../flightsByLegs/actions';
import { setRTMode } from '../../fareFamilies/isRTMode/actions';
import { clearSelectedFamilies } from '../../fareFamilies/selectedFamilies/actions';
import { addFlights, clearFlights } from '../../flights/actions';
import { batchActions } from '../../batching/actions';
import { ResultsState } from '../reducers';
import Flight from '../../../models/Flight';
import { loadResults } from '../../../services/requests/results';
import { addFlightsRT } from '../../flightsRT/actions';

function* loadAllResults(resultsInfo: ResultsState[], locale: Language, nemoURL: string) {
	const max = resultsInfo.length;
	const requests: CallEffect[] = [];

	for (let i = 0; i < max; i++) {
		requests.push(call(loadResults, trimSlashes(resultsInfo[i].id.toString()), locale, nemoURL));
	}

	const results: Flight[][] = yield all(requests);

	for (let i = 0; i < max; i++) {
		const info = resultsInfo[i];
		const flights = results[i];

		if (info.isRT) {
			yield put(addFlights(flights));
			yield put(addFlightsRT(flights));
		}
		else {
			flights.forEach(flight => flight.legId = i);

			yield put(addFlights(flights));
			yield put(setFlightsByLeg(flights, i));
		}
	}
}

function* worker({ payload }: ResultsAction) {
	const isLoading: boolean = yield select(getIsLoading);
	const locale: Language = yield select(getLocale);
	const nemoURL: string = yield select(getNemoURL);

	if (!isLoading && payload.length) {
		// Launch loading animation.
		yield put(startLoading());

		// Get last results id.
		const resultsId = trimSlashes(payload[payload.length - 1].id.toString());

		// Load search info.
		const searchInfo: SearchInfo = yield call(loadSearchInfo, resultsId, locale, nemoURL);

		// Create legs array.
		yield put(setLegs(createLegs(createSearchPayload(searchInfo).requests)));

		// Load search results.
		yield call(loadAllResults, payload, locale, nemoURL);

		// Stop loading animation.
		yield put(stopLoading());
	}
}

export default function* loadSearchResultsSaga() {
	yield takeEvery(LOAD_SEARCH_RESULTS, worker);
}
