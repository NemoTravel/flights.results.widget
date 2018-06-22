import { put, takeEvery } from 'redux-saga/effects';
import { Action } from 'redux';

import { removeAllAirlines } from '../airlines/actions';
import { removeAllAirports } from '../airports/actions';
import { FILTERS_REMOVE_ALL } from '../actions';
import { removeAllTimeIntervals } from '../time/actions';
import { setDirectFlights } from '../directOnly/actions';
import { removeFlightSearch } from '../flightSearch/actions';
import { removeComfortable } from '../comfortable/actions';
import { batchActions } from '../../batching/actions';

function* worker() {
	const actions: Action[] = [];

	actions.push(setDirectFlights(false));
	actions.push(removeAllAirports());
	actions.push(removeAllAirlines());
	actions.push(removeAllTimeIntervals());
	actions.push(removeFlightSearch());
	actions.push(removeComfortable());

	yield put(batchActions(...actions));
}

export default function* removeAllFiltersSaga() {
	yield takeEvery(FILTERS_REMOVE_ALL, worker);
}
