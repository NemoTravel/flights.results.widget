import { Currency } from '../../enums';
import { CurrencyAction, SET_CURRENCY } from './actions';

export const currencyReducer = (state: Currency = Currency.RUB, action: CurrencyAction): Currency => {
	switch (action.type) {
		case SET_CURRENCY:
			return action.payload;
	}

	return state;
};
