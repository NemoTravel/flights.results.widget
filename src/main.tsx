import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Action, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import * as moment from 'moment';
import 'whatwg-fetch';

import Main from './components/Main';
import themeObject from './themes/default';
import {
	SET_CONFIG,
	SET_FLIGHTS, setConfig, SetConfigAction, setFlights, SetFlightsAction, START_LOADING, startLoading, STOP_LOADING,
	stopLoading
} from './store/actions';
import './css/main.scss';
import { parse } from './services/parsers/results';
import Flight from './schemas/Flight';
import {
	FilterAirlinesAction, FILTERS_ADD_AIRLINE, FILTERS_REMOVE_AIRLINE,
	FILTERS_TOGGLE_DIRECT_FLIGHTS
} from './store/filters/actions';

const momentDurationFormatSetup = require('moment-duration-format');

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React);
// }

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

export interface Config {
	rootElement: HTMLElement;
	locale: Language;
}

interface FiltersState {
	airlines: string[];
	directOnly: boolean;
}

export interface ApplicationState {
	isLoading: boolean;
	config: Config;
	flights: Flight[];
	filters: FiltersState;
}

const initalConfig: Config = {
	rootElement: document.getElementById('root'),
	locale: Language.English
};

const configReducer = (state: Config = initalConfig, action: SetConfigAction): Config => {
	switch (action.type) {
		case SET_CONFIG:
			return action.payload;
	}

	return state;
};

const directOnly = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case FILTERS_TOGGLE_DIRECT_FLIGHTS:
			return !state;
	}

	return state;
};

const airlinesFilter = (state: string[] = [], action: FilterAirlinesAction): string[] => {
	switch (action.type) {
		case FILTERS_ADD_AIRLINE:
			const result: string[] = [...state];

			if (!state.find(code => code === action.payload)) {
				result.push(action.payload);
			}

			return result;

		case FILTERS_REMOVE_AIRLINE:
			return state.filter(code => code !== action.payload);
	}

	return state;
};

const loadingReducer = (state: boolean = false, action: Action): boolean => {
	switch (action.type) {
		case START_LOADING:
			return true;

		case STOP_LOADING:
			return false;
	}

	return state;
};

const flightsReducer = (state: Flight[] = [], action: SetFlightsAction): Flight[] => {
	switch (action.type) {
		case SET_FLIGHTS:
			return action.payload;
	}

	return state;
};

const rootReducer = combineReducers<ApplicationState>({
	isLoading: loadingReducer,
	flights: flightsReducer,
	filters: combineReducers<FiltersState>({
		airlines: airlinesFilter,
		directOnly: directOnly
	}),
	config: configReducer
});

export const init = (config: Config) => {
	const searchId = 215646;
	const store = createStore<ApplicationState>(rootReducer);
	const theme = createMuiTheme(themeObject);

	store.dispatch(setConfig(config));
	store.dispatch(startLoading());
	momentDurationFormatSetup(moment);
	moment.locale(config.locale);

	fetch(`http://nemo1/?go=orderAPI/get&uri=flight/search/${searchId}`)
		.then((response: Response) => response.json())
		.then((response: any) => {
			const flights = parse(response, searchId);

			store.dispatch(stopLoading());
			store.dispatch(setFlights(flights));
		});

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
