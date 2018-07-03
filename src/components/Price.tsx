import * as React from 'react';
import Money from '../schemas/Money';
import { Currency } from '../enums';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { getCurrencyCoefficient } from '../store/selectors';

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
		return true;
	}

	render(): React.ReactNode {
		if (!this.props.price) {
			return null;
		}

		let amount = this.props.price.amount.toString().replace(/[+\-]/, '');
		const withMinus = this.props.price.amount < 0;
		let result = amount;

		amount = (parseFloat(amount) * this.props.coefficient).toString();

		if (amount.length > THOUSANDS_INDEX) {
			const head = amount.substr(0, amount.length - THOUSANDS_INDEX);
			const tail = amount.substr(amount.length - THOUSANDS_INDEX);

			result = (head ? head + ' ' : '') + tail;
		}

		return <span className="price">
		<span className="price-amount">{this.props.withPlus && this.props.price.amount >= 0 ? '+' : ''}{withMinus ? '–' : ''} {result}</span>
		<span className="price-currency">{this.props.currency}</span>
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
