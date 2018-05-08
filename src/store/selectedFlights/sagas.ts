import { all } from 'redux-saga/effects';
import selectFlightSaga from './sagas/selectFlight';

export default function* selectedFlightsSagas() {
	yield all([
		selectFlightSaga()
	]);
}
