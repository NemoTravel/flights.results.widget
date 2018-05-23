import './ponyfills';
import * as React from 'react';
import createSagaMiddleware from 'redux-saga';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import * as moment from 'moment';
import 'whatwg-fetch';

import './css/main.scss';
import themeObject from './themes/default';
import { rootReducer } from './store/reducers';
import { setConfig } from './store/config/actions';
import { Config } from './store/config/reducers';
import Main from './components/Main';
import sagas from './store/sagas';

const momentDurationFormatSetup = require('moment-duration-format');

// if (process.env.NODE_ENV !== 'production') {
// 	const { whyDidYouUpdate } = require('why-did-you-update');
// 	whyDidYouUpdate(React);
// }

export const init = (config: Config) => {
	const sagaMiddleware = createSagaMiddleware();
	const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger));
	const theme = createMuiTheme(themeObject);

	sagaMiddleware.run(sagas);

	store.dispatch(setConfig(config));
	momentDurationFormatSetup(moment);
	moment.locale(config.locale);

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<Main/>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};
