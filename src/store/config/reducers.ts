import { SET_CONFIG, SetConfigAction } from './actions';
import { Currency, Language } from '../../enums';
import CurrencyRates from '../../schemas/CurrencyRates';
import I18nPool from '../../schemas/I18nPool';
import { trimSlashes } from '../../utils';

export interface Config {
	rootElement: HTMLElement;
	nemoURL?: string;
	locale?: Language;
	// http://frontend.mlsd.ru/api/system/info/currencyRates
	currencyRates?: CurrencyRates;
	defaultCurrency?: Currency;
	i18n?: I18nPool;
}

const initalConfig: Config = {
	rootElement: document.getElementById('root'),
	nemoURL: 'http://frontend.mlsd.ru',
	currencyRates: {},
	defaultCurrency: Currency.RUB,
	i18n: {},
	locale: Language.English
};

export const configReducer = (state: Config = initalConfig, action: SetConfigAction): Config => {
	switch (action.type) {
		case SET_CONFIG:
			const newConfig = { ...state, ...action.payload };

			newConfig.nemoURL = trimSlashes(newConfig.nemoURL) + '/';

			return newConfig;
	}

	return state;
};
