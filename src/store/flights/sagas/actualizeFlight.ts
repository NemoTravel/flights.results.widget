import { all, call, CallEffect, put, select, take, takeEvery } from 'redux-saga/effects';
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
import { addFlights, removeFlights } from '../actions';
import { addFlightByLeg } from '../../flightsByLegs/actions';
import { STOP_LOADING_FARE_FAMILIES } from '../../isLoadingFareFamilies/actions';
import { isLoadingFareFamilies } from '../../isLoadingFareFamilies/selectors';
import { canBeOtherCombinationChoose, getResultingFlightIds } from '../../fareFamilies/selectors';

function* runActualizations(flightIds: string[], locale: Language, nemoURL: string) {
	const numOfFlights = flightIds.length;
	const tasks: CallEffect[] = [];

	for (let i = 0; i < numOfFlights; i++) {
		tasks.push(call(actualization, flightIds[i], locale, nemoURL));
	}

	const result: AvailabilityInfo[] = yield all(tasks);

	// Something went wrong. Abort.
	if (!result.length || result.length !== numOfFlights || !!result.find(flightInfo => !flightInfo)) {
		return yield put(batchActions(
			setProblemType(ActualizationProblem.Unknown),
			setInfo([]),
			stopLoadingActualization()
		));
	}

	// Check if any flight ID has changed during actualization.
	for (let i = 0; i < numOfFlights; i++) {
		const oldFlightId = flightIds[i].toString();
		const newFlight = result[i].flight;

		if (oldFlightId !== newFlight.id.toString()) {
			// OK, flight ID has changed, remove the old one and add the new one.
			yield put(batchActions(
				removeFlights([oldFlightId]),
				addFlights([newFlight]),
				addFlightByLeg(newFlight, i)
			));
		}
	}

	// There are some unavailable flights. Abort.
	const unavailableFlights = result.filter(flightInfo => !flightInfo.isAvailable);

	if (unavailableFlights.length) {
		return yield put(batchActions(
			setProblemType(ActualizationProblem.Availability),
			setInfo(unavailableFlights),
			removeFlights(unavailableFlights.map(flightInfo => flightInfo.flight.id)),
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

export function* actualizeFlightSaga() {
	yield takeEvery(START_ACTUALIZATION, worker);
}

export function* cannotChangeFamily() {
	while (true) {
		yield take(STOP_LOADING_FARE_FAMILIES);

		const isLoading = yield select(isLoadingFareFamilies);

		if (!isLoading) {
			const fareAvailable = yield select(canBeOtherCombinationChoose);
			const flightIds: string[] = yield select(getResultingFlightIds);

			if (!fareAvailable) {
				yield worker({ type: START_ACTUALIZATION, payload: { flightIds: flightIds } });
			}
		}
	}
}
