import { all } from 'redux-saga/effects';
import loadSearchResultsSaga from './sagas/loadSearchResults';

export default function* resultsSagas() {
	yield all([
		loadSearchResultsSaga()
	]);
}
