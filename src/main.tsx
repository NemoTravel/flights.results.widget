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

const momentDurationFormatSetup = require('moment-duration-format');

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React);
// }

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
