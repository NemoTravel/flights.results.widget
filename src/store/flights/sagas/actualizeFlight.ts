import { all, call, CallEffect, fork, put, select, takeEvery } from 'redux-saga/effects';
import { ActualizationAction, START_ACTUALIZATION } from '../../actions';
import { getIsLoadingActualization } from '../../isLoadingActualization/selectors';
import { startLoadingActualization, stopLoadingActualization } from '../../isLoadingActualization/actions';
import actualization from '../../../services/requests/actualization';
import { getLocale } from '../../config/selectors';
import { Language } from '../../../enums';

function* runActualizations(flightIds: string[], locale: Language) {
	const max = flightIds.length;
	const tasks: CallEffect[] = [];

	for (let i = 0; i < max; i++) {
		tasks.push(call(actualization, flightIds[i], locale));
	}

	const result = yield all(tasks);

	console.log(result);
}

function* worker({ payload }: ActualizationAction) {
	const isLoading: boolean = yield select(getIsLoadingActualization);
	const locale: Language = yield select(getLocale);

	if (!isLoading) {
		yield put(startLoadingActualization());

		yield call(runActualizations, payload.flightIds, locale);

		yield put(stopLoadingActualization());
	}
}

export default function* actualizeFlightSaga() {
	yield takeEvery(START_ACTUALIZATION, worker);
}
