import * as React from 'react';
import Money from '../schemas/Money';

interface Props {
	price: Money;
	withPlus?: boolean;
	withMinus?: boolean;
}

const THOUSANDS_INDEX = 3;

export default ({ price, withPlus = false }: Props) => {
	if (!price) {
		return null;
	}

	const amount = price.amount.toString().replace(/[+\-]/, '');
	const withMinus = price.amount < 0;
	let result = amount;

	if (amount.length > THOUSANDS_INDEX) {
		const head = amount.substr(0, amount.length - THOUSANDS_INDEX);
		const tail = amount.substr(amount.length - THOUSANDS_INDEX);

		result = (head ? head + ' ' : '') + tail;
	}

	return <span className="price">
		<span className="price-amount">{withPlus && price.amount >= 0 ? '+' : ''}{withMinus ? '-' : ''} {result}</span>
		<span className="price-currency">{price.currency}</span>
	</span>;
};
