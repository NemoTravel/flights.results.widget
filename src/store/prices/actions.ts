import { Action } from 'redux';
import { PricesState } from '../../state';

export const SET_PRICES = 'SET_PRICES';

export interface PricesAction extends Action {
	payload: PricesState;
}

export const setPrices = (prices: PricesState): PricesAction => {
	return {
		type: SET_PRICES,
		payload: prices
	};
};
