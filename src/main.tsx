import './ponyfills';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';
import { createHashHistory } from 'history';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import './css/main.scss';
import themeObject from './themes/default';
import { rootReducer, RootState } from './store/reducers';
import { setConfig } from './store/config/actions';
import { Config } from './store/config/reducers';
import Main from './components/Main';
import sagas from './store/sagas';
import * as i18n from './i18n';
import { setCurrency } from './store/currency/actions';
import { Currency } from './enums';

const momentDurationFormatSetup = require('moment-duration-format');
const middlewares: Middleware[] = [];

if (process.env.NODE_ENV !== 'production') {
	middlewares.push(logger);
}

let storeGlobal: Store<RootState>;

export const init = (config: Config) => {
	const sagaMiddleware = createSagaMiddleware();
	const history = createHashHistory();

	middlewares.push(sagaMiddleware);
	middlewares.push(routerMiddleware(history));

	const store = createStore(connectRouter(history)(rootReducer), applyMiddleware(...middlewares));
	const theme = createMuiTheme(themeObject);

	storeGlobal = store;

	sagaMiddleware.run(sagas);

	store.dispatch(setConfig(config));
	store.dispatch(setCurrency(store.getState().config.defaultCurrency));
	momentDurationFormatSetup(moment);
	moment.locale(config.locale);
	i18n.init(config.locale, config.i18n);

	ReactDOM.render(<Provider store={store}>
		<MuiThemeProvider theme={theme}>
			<ConnectedRouter history={history}>
				<Main/>
			</ConnectedRouter>
		</MuiThemeProvider>
	</Provider>, config.rootElement);
};

const setMoneyCurrency = (currency: string) => {
	storeGlobal.dispatch(setCurrency(currency as Currency));
};

document.addEventListener('cc:changeCurrency', (e: any) => {
	setMoneyCurrency(e.detail.currency);
});
