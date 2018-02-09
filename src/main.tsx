import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { AnyAction, createStore } from 'redux';
import { Provider } from 'react-redux';
import * as moment from 'moment';
// import * as momentDurationFormatSetup from 'moment-duration-format';
import 'whatwg-fetch';

import Main from './components/Main';
import themeObject from './themes/default';
import {
	SET_FLIGHTS, setFlights, SetFlightsAction, START_LOADING, startLoading, STOP_LOADING,
	stopLoading
} from './store/actions';
import './css/main.scss';
import { parse } from './services/parsers/results';
import Flight from './schemas/Flight';

// momentDurationFormatSetup(moment);

enum Language {
	Russian = 'ru',
	English = 'en'
}

export enum PassengerType {
	Adult = 'ADT',
	Child = 'CLD',
	Infant = 'INF',
	InfantWithSeat = 'INS'
}

interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

export interface ApplicationState {
	isLoading: boolean;
	config: Config;
	flights: Flight[];
}

const initalConfig: Config = {
	rootElement: document.getElementById('root'),
	locale: Language.English
};

const initialState: ApplicationState = {
	isLoading: false,
	config: initalConfig,
	flights: []
};

const rootReducer = (state: ApplicationState, action: AnyAction): ApplicationState => {
	switch (action.type) {
		case START_LOADING:
			return { ...state, isLoading: true };

		case STOP_LOADING:
			return { ...state, isLoading: false };

		case SET_FLIGHTS:
			return { ...state, flights: (action as SetFlightsAction).payload };
	}

	return state;
};

export const init = (config: Config) => {
	const searchId = 215163;
	const store = createStore<ApplicationState>(rootReducer, { ...initialState, config });
	const theme = createMuiTheme(themeObject);

	store.dispatch(startLoading());

	fetch(`http://nemo1/?go=orderAPI/get&uri=flight/search/${searchId}`)
		.then((response: Response) => response.json())
		.then((response: any) => {
			const flights = parse(response, searchId);

			console.log(flights[0]);

			store.dispatch(stopLoading());
			store.dispatch(setFlights(flights));
		});

	moment.locale(config.locale);

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
