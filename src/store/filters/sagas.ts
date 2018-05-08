import { all, put, takeEvery } from 'redux-saga/effects';
import { setDirectFlights } from './directOnly/actions';
import { removeAllAirlines } from './airlines/actions';
import { removeAllAirports } from './airports/actions';
import { removeAllTimeIntervals } from './time/actions';
import { FILTERS_REMOVE_ALL } from './actions';

function* removeAllFiltersWorker() {
	yield put(setDirectFlights(false));
	yield put(removeAllAirports());
	yield put(removeAllAirlines());
	yield put(removeAllTimeIntervals());
}

function* removeAllFiltersWatcher() {
	yield takeEvery(FILTERS_REMOVE_ALL, removeAllFiltersWorker);
}

export default function* filtersSagas() {
	yield all([
		removeAllFiltersWatcher()
	]);
}
