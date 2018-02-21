import * as React from 'react';
import Money from '../schemas/Money';

interface Props {
	price: Money;
	withPlus?: boolean;
}

const THOUSANDS_INDEX = 3;

export default ({ price, withPlus = false }: Props) => {
	const amount = price.amount.toString();
	const head = amount.substr(0, amount.length - THOUSANDS_INDEX);
	const tail = amount.substr(amount.length - THOUSANDS_INDEX);

	return <span className="price">
		<span className="price-amount">{withPlus ? '+' : ''} {head}&nbsp;{tail}</span>
		<span className="price-currency">{price.currency}</span>
	</span>;
};
