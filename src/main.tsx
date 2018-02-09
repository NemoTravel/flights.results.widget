import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import {AnyAction, createStore} from 'redux';
import { Provider } from 'react-redux';
import * as moment from 'moment';
import 'whatwg-fetch';

import Main from './components/Main';
import themeObject from './themes/default';
import { START_LOADING, startLoading, STOP_LOADING, stopLoading } from './store/actions';
import './css/main.scss';

enum Language {
	Russian = 'ru',
	English = 'en'
}

interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

export interface ApplicationState {
	isLoading: boolean;
	config: Config;
}

const initalConfig: Config = {
	rootElement: document.getElementById('root'),
	locale: Language.English
};

const initialState: ApplicationState = {
	isLoading: false,
	config: initalConfig
};

const rootReducer = (state: ApplicationState, action: AnyAction): ApplicationState => {
	switch (action.type) {
		case START_LOADING:
			return { ...state, isLoading: true };

		case STOP_LOADING:
			return { ...state, isLoading: false };
	}

	return state;
};

export const init = (config: Config) => {
	const store = createStore<ApplicationState>(rootReducer, { ...initialState, config });
	const theme = createMuiTheme(themeObject);

	store.dispatch(startLoading());

	fetch('http://nemo1/?go=orderAPI/get&uri=flight/search/215011')
		.then((response: Response) => response.json())
		.then((response: string) => {
			store.dispatch(stopLoading());
		});

	moment.locale(config.locale);

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
