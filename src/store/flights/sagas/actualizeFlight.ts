import { all, call, CallEffect, fork, put, select, takeEvery } from 'redux-saga/effects';
import { ActualizationAction, START_ACTUALIZATION } from '../../actions';
import { getIsLoadingActualization } from '../../isLoadingActualization/selectors';
import { startLoadingActualization, stopLoadingActualization } from '../../isLoadingActualization/actions';
import actualization from '../../../services/requests/actualization';
import { getLocale } from '../../config/selectors';
import { Language } from '../../../enums';
import AvailabilityInfo from '../../../schemas/AvailabilityInfo';
import { REQUEST_URL } from '../../../utils';

function* runActualizations(flightIds: string[], locale: Language) {
	const max = flightIds.length;
	const tasks: CallEffect[] = [];

	for (let i = 0; i < max; i++) {
		tasks.push(call(actualization, flightIds[i], locale));
	}

	const result: AvailabilityInfo[] = yield all(tasks);

	if (!result.length || !!result.find(flightInfo => !flightInfo)) {
		console.warn('Произошла непредвиденная ошибка!');
		throw new Error('Произошла непредвиденная ошибка!');
	}

	const unavailableFlights = result.filter(flightInfo => !flightInfo.isAvailable);

	if (unavailableFlights.length) {
		console.warn(unavailableFlights);
		throw new Error('Некоторые перелеты стали неактуальны');
	}

	const modifiedFlights = result.filter(flightInfo => flightInfo.priceInfo.hasChanged);

	if (modifiedFlights.length) {
		console.warn(modifiedFlights);
		throw new Error('У некоторых перелетов изменилась цена');
	}

	window.location.href = `${REQUEST_URL}${result[0].orderLink.replace('/', '')}`;
}

function* worker({ payload }: ActualizationAction) {
	const isLoading: boolean = yield select(getIsLoadingActualization);
	const locale: Language = yield select(getLocale);

	if (!isLoading) {
		yield put(startLoadingActualization());

		try {
			yield call(runActualizations, payload.flightIds, locale);
		}
		catch (e) {
			yield put(stopLoadingActualization());
			throw e;
		}
	}
}

export default function* actualizeFlightSaga() {
	yield takeEvery(START_ACTUALIZATION, worker);
}
