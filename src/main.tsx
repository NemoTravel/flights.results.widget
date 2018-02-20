import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import * as moment from 'moment';
import 'whatwg-fetch';

import Main from './components/Main';
import themeObject from './themes/default';
import './css/main.scss';
import 'react-virtualized/styles.css';
import { parse } from './services/parsers/results';
import { rootReducer } from './store/reducers';
import { setConfig } from './store/config/actions';
import { startLoading, stopLoading } from './store/isLoading/actions';
import { setFlights } from './store/flights/actions';
import { ApplicationState, Config } from './state';
import Flight from './schemas/Flight';

const momentDurationFormatSetup = require('moment-duration-format');

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React);
// }

export const init = (config: Config) => {
	const store = createStore<ApplicationState>(rootReducer);
	const theme = createMuiTheme(themeObject);

	store.dispatch(setConfig(config));
	store.dispatch(startLoading());
	momentDurationFormatSetup(moment);
	moment.locale(config.locale);

	const firstSearchId = 216724;
	const secondSearchId = 216725;

	const promises = [ firstSearchId, secondSearchId ].map(searchId => {
		return fetch(`http://release.mlsd.ru/?go=orderAPI/get&uri=flight/search/${firstSearchId}`)
			.then((response: Response) => response.json())
			.then((response: any) => parse(response, searchId));
	});

	Promise.all(promises).then((results: Flight[][]) => {
		results.forEach((flights: Flight[], legId: number) => {
			store.dispatch(setFlights(flights, legId));
		});

		store.dispatch(stopLoading());
	});

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
