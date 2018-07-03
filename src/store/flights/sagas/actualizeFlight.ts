import { all, call, CallEffect, fork, put, select, takeEvery } from 'redux-saga/effects';
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

function* runActualizations(flightIds: string[], locale: Language, nemoURL: string) {
	const max = flightIds.length;
	const tasks: CallEffect[] = [];

	for (let i = 0; i < max; i++) {
		tasks.push(call(actualization, flightIds[i], locale, nemoURL));
	}

	const result: AvailabilityInfo[] = yield all(tasks);

	if (!result.length || !!result.find(flightInfo => !flightInfo)) {
		yield put(batchActions(
			setProblemType(ActualizationProblem.Unknown),
			setInfo([]),
			stopLoadingActualization()
		));

		return;
	}

	const unavailableFlights = result.filter(flightInfo => !flightInfo.isAvailable);

	if (unavailableFlights.length) {
		yield put(batchActions(
			setProblemType(ActualizationProblem.Availability),
			setInfo(unavailableFlights),
			stopLoadingActualization()
		));
	}
	else {
		const modifiedFlights = result.filter(flightInfo => flightInfo.priceInfo.hasChanged);

		if (modifiedFlights.length) {
			yield put(batchActions(
				setProblemType(ActualizationProblem.Price),
				setInfo(modifiedFlights),
				stopLoadingActualization()
			));
		}
		else {
			window.location.href = `${nemoURL}${result[0].orderLink.replace('/', '')}`;
		}
	}
}

function* worker({ payload }: ActualizationAction) {
	const isLoading: boolean = yield select(getIsLoadingActualization);
	const locale: Language = yield select(getLocale);
	const nemoURL: string = yield select(getNemoURL);

	if (!isLoading) {
		yield put(startLoadingActualization());
		yield call(runActualizations, payload.flightIds, locale, nemoURL);
	}
}

export default function* actualizeFlightSaga() {
	yield takeEvery(START_ACTUALIZATION, worker);
}
