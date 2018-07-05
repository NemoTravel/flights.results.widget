import * as React from 'react';
import Money from '../schemas/Money';
import { Currency, CurrencyCode } from '../enums';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { getCurrencyCoefficient, digitsAfterPoint } from '../store/currency/selectors';

interface Props {
	price: Money;
	withPlus?: boolean;
	withMinus?: boolean;
}

interface StateProps {
	currency: Currency;
	coefficient: number;
}

const THOUSANDS_INDEX = 3;

class Price extends React.Component<Props & StateProps> {
	shouldComponentUpdate(nextProps: Props & StateProps): boolean {
		return this.props.currency !== nextProps.currency ||
			this.props.coefficient !== nextProps.coefficient ||
			this.props.price !== nextProps.price;
	}

	getFormattedAmount(amount: string): string {
		let tmpAmount = amount,
			fraction = '';

		const parts = [],
			pointIndex = tmpAmount.indexOf('.');

		if (pointIndex >= 0) {
			fraction = tmpAmount.substr(pointIndex);
			tmpAmount = tmpAmount.substr(0, pointIndex);
		}

		while(tmpAmount) {
			parts.push(tmpAmount.substr(-THOUSANDS_INDEX));
			tmpAmount = tmpAmount.substr(0, tmpAmount.length - THOUSANDS_INDEX);
		}

		parts.reverse();

		return parts.join(' ') + fraction;
	}

	getConvertedAmount(amount: string): string {
		const currency = this.props.currency,
			currencyRound = Math.pow(10, digitsAfterPoint[currency]),
			currencyCoefficient = this.props.coefficient;

		return (Math.round(parseFloat(amount) * currencyCoefficient * currencyRound) / currencyRound).toString();
	}

	render(): React.ReactNode {
		if (!this.props.price) {
			return null;
		}

		let amount = this.props.price.amount.toString().replace(/[+\-]/, '');
		const withMinus = this.props.price.amount < 0;

		amount = this.getFormattedAmount(this.getConvertedAmount(amount));

		const currency = CurrencyCode[this.props.currency];

		return <span className="price">
		<span className="price-amount">{this.props.withPlus && this.props.price.amount >= 0 ? '+' : ''}{withMinus ? '–' : ''} {amount}</span>
		<span className="price-currency">{currency}</span>
	</span>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		currency: state.currency,
		coefficient: getCurrencyCoefficient(state)
	};
};

export default connect(mapStateToProps)(Price);
