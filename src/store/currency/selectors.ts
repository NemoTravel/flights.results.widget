import CurrencyRates from '../../schemas/CurrencyRates';
import { createSelector } from 'reselect';
import { RootState } from '../reducers';
import { Currency } from '../../enums';

export const getCurrency = (state: RootState): Currency => state.currency;
const getRate = (state: RootState): CurrencyRates => state.config.currencyRates;

interface CurrencyRoundList {
	[currency: string]: number;
}

export const digitsAfterPoint: CurrencyRoundList = {
	RUB: 0,
	USD: 2,
	GBP: 2,
	EUR: 2,
	CNY: 2,
	LVL: 2,
	UAH: 2,
	CZK: 2,
	JPY: 2
};

export const getCurrencyCoefficient = createSelector(
	[getCurrency, getRate],
	(currency: Currency, rate: CurrencyRates): number => {
		return rate.hasOwnProperty(currency) ? parseFloat(rate[currency]) : 1;
	}
);
