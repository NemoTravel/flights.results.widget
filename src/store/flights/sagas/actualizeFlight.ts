import { all, call, CallEffect, put, select, takeEvery } from 'redux-saga/effects';
import { ActualizationAction, START_ACTUALIZATION } from '../../actions';
import { getIsLoadingActualization } from '../../isLoadingActualization/selectors';
import { startLoadingActualization, stopLoadingActualization } from '../../isLoadingActualization/actions';
import actualization from '../../../services/requests/actualization';
import { getLocale, getNemoURL } from '../../config/selectors';
import { Language } from '../../../enums';
import AvailabilityInfo from '../../../schemas/AvailabilityInfo';
import { batchActions } from '../../batching/actions';
import { setProblemType } from '../../actualization/problem/actions';
import { ActualizationProblem } from '../../actualization/reducers';
import { setInfo } from '../../actualization/info/actions';
import { clearActualizationProblems } from '../../actualization/actions';
import { removeFlights } from '../actions';

function* runActualizations(flightIds: string[], locale: Language, nemoURL: string) {
	const max = flightIds.length;
	const tasks: CallEffect[] = [];

	for (let i = 0; i < max; i++) {
		tasks.push(call(actualization, flightIds[i], locale, nemoURL));
	}

	const result: AvailabilityInfo[] = yield all(tasks);

	// Something went wrong. Abort.
	if (!result.length || result.length !== max || !!result.find(flightInfo => !flightInfo)) {
		return yield put(batchActions(
			setProblemType(ActualizationProblem.Unknown),
			setInfo([]),
			stopLoadingActualization()
		));
	}

	// There are some unavailable flights. Abort.
	const unavailableFlights = result.filter(flightInfo => !flightInfo.isAvailable);

	if (unavailableFlights.length) {
		return yield put(batchActions(
			setProblemType(ActualizationProblem.Availability),
			setInfo(unavailableFlights),
			removeFlights(unavailableFlights.map(flightInfo => flightInfo.flight)),
			stopLoadingActualization()
		));
	}

	// The price has changed. Abort.
	const modifiedFlights = result.filter(flightInfo => flightInfo.priceInfo.hasChanged);

	if (modifiedFlights.length) {
		return yield put(batchActions(
			setProblemType(ActualizationProblem.Price),
			setInfo(modifiedFlights),
			stopLoadingActualization()
		));
	}

	// All fine. Move on.
	window.location.href = `${nemoURL}${result[0].orderLink.replace('/', '')}`;
}

function* worker({ payload }: ActualizationAction) {
	const isLoading: boolean = yield select(getIsLoadingActualization);
	const locale: Language = yield select(getLocale);
	const nemoURL: string = yield select(getNemoURL);

	if (!isLoading) {
		yield put(startLoadingActualization());
		yield put(clearActualizationProblems());
		yield call(runActualizations, payload.flightIds, locale, nemoURL);
	}
}

export default function* actualizeFlightSaga() {
	yield takeEvery(START_ACTUALIZATION, worker);
}
