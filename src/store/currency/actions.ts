import { Action } from 'redux';
import { Currency } from '../../enums';

export const SET_CURRENCY = 'SET_CURRENCY';

export interface CurrencyAction extends Action {
	payload: Currency;
}

export const setCurrency = (currency: Currency): CurrencyAction => {
	return {
		type: SET_CURRENCY,
		payload: currency
	};
};
