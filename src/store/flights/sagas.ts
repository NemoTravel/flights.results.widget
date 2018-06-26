import { all } from 'redux-saga/effects';
import actualizeFlightSaga from './sagas/actualizeFlight';

export default function* flightsSagas() {
	yield all([
		actualizeFlightSaga()
	]);
}
