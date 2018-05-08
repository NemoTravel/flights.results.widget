import { all } from 'redux-saga/effects';
import goToLegSaga from './sagas/goToLeg';
import goBackSaga from './sagas/goBack';

export default function* currentLegSagas() {
	yield all([
		goToLegSaga(),
		goBackSaga()
	]);
}
