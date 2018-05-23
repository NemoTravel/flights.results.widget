import { put, takeEvery } from 'redux-saga/effects';
import { removeAllAirlines } from '../airlines/actions';
import { removeAllAirports } from '../airports/actions';
import { FILTERS_REMOVE_ALL } from '../actions';
import { removeAllTimeIntervals } from '../time/actions';
import { setDirectFlights } from '../directOnly/actions';
import { removeFlightNumber } from '../flightNumber/actions';

function* worker() {
	yield put(setDirectFlights(false));
	yield put(removeAllAirports());
	yield put(removeAllAirlines());
	yield put(removeAllTimeIntervals());
	yield put(removeFlightNumber());
}

export default function* removeAllFiltersSaga() {
	yield takeEvery(FILTERS_REMOVE_ALL, worker);
}
