import { all } from 'redux-saga/effects';
import { actualizeFlightSaga, cannotChangeFamily } from './sagas/actualizeFlight';

export default function* flightsSagas() {
	yield all([
		actualizeFlightSaga(),
		cannotChangeFamily()
	]);
}
