import { call, put, select, takeEvery } from 'redux-saga/effects';
import { LOAD_SEARCH_RESULTS, ResultsAction } from '../actions';
import { getIsLoading } from '../../isLoading/selectors';
import { startLoading, stopLoading } from '../../isLoading/actions';
import loadSearchInfo from '../../../services/requests/searchInfo';
import { Language } from '../../../enums';
import { getLocale, getNemoURL } from '../../config/selectors';
import { SearchInfo } from '@nemo.travel/search-widget';
import { trimSlashes } from '../../../utils';

function* worker({ payload }: ResultsAction) {
	const isLoading: boolean = yield select(getIsLoading);
	const locale: Language = yield select(getLocale);
	const nemoURL: string = yield select(getNemoURL);

	if (!isLoading && payload.length) {
		// Launch loading animation.
		yield put(startLoading());

		// Get last results id.
		const resultsId = trimSlashes(payload[payload.length - 1].id.toString());

		// Load search info.
		const searchInfo: SearchInfo = yield call(loadSearchInfo, resultsId, locale, nemoURL);

		console.log(searchInfo);

		// Stop loading animation.
		yield put(stopLoading());
	}
}

export default function* loadSearchResultsSaga() {
	yield takeEvery(LOAD_SEARCH_RESULTS, worker);
}
