import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import * as moment from 'moment';
import 'whatwg-fetch';

import './css/main.scss';
import 'react-virtualized/styles.css';

import themeObject from './themes/default';
import { rootReducer } from './store/reducers';
import { setConfig } from './store/config/actions';
import { Config } from './state';
import Main from './components/Main';

const momentDurationFormatSetup = require('moment-duration-format');

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React);
// }

export const init = (config: Config) => {
	const store = createStore(rootReducer, applyMiddleware(thunk));
	const theme = createMuiTheme(themeObject);

	store.dispatch(setConfig(config));
	momentDurationFormatSetup(moment);
	moment.locale(config.locale);

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
