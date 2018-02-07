import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AnyAction, createStore} from 'redux';
import { Provider } from 'react-redux';
import 'whatwg-fetch';

import Main from './components/Main';
import './css/main.scss';

enum Language {
	Russian = 'ru',
	English = 'en'
}

interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

interface ApplicationState {
	locale: Language;
}

const initialState: ApplicationState = {
	locale: Language.English
};

const rootReducer = (state: ApplicationState = initialState, action: AnyAction): ApplicationState => {
	return state;
};

export const init = (config: Config) => {
	const store = createStore<ApplicationState>(rootReducer);

	ReactDOM.render(<Provider store={store}>
		<Main/>
	</Provider>, config.rootElement);
};
