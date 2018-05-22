import * as React from 'react';
import * as classnames from 'classnames';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FareFamily from '../../schemas/FareFamily';
import Money from '../../schemas/Money';
import Price from '../Price';
import Features from './Features';

interface Props {
	id: string;
	family: FareFamily;
	isSelected: boolean;
	isDisabled?: boolean;
	onChange: (familyId: string) => void;
	price: Money;
}

class Family extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isDisabled: false
	};

	constructor(props: Props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(event: React.ChangeEvent<{}>): void {
		if (!this.props.isDisabled) {
			const inputValue = (event.target as HTMLInputElement).value;

			this.props.onChange(inputValue);
		}
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.id !== nextProps.id ||
			this.props.isSelected !== nextProps.isSelected ||
			this.props.price !== nextProps.price ||
			this.props.family !== nextProps.family;
	}

	renderPrice(): React.ReactNode {
		const { isDisabled, isSelected, price } = this.props;
		let result = null;

		if (isDisabled || !price) {
			result = '—';
		}
		else if (isSelected) {
			result = 'Выбрано';
		}
		else {
			result = <Price withPlus={price && price.amount > 0} withMinus={price && price.amount < 0} price={price}/>;
		}

		return result;
	}

	render(): React.ReactNode {
		const { id, family, isDisabled, isSelected, price } = this.props;

		return <div className={classnames('fareFamilies-leg-segment-family', {
			'fareFamilies-leg-segment-family_disabled': isDisabled,
			'fareFamilies-leg-segment-family_notAvailable': !price,
			'fareFamilies-leg-segment-family_selected': isSelected
		})}>
			<div className="fareFamilies-leg-segment-family__name">
				<FormControlLabel
					name="family"
					label={family.fareFamilyName}
					checked={this.props.isSelected}
					value={id}
					control={<Radio color="primary"/>}
					onChange={this.onChange}
				/>
			</div>

			<div className="fareFamilies-leg-segment-family__price">
				{this.renderPrice()}
			</div>

			<Features features={[
				...family.fareFeatures.baggage,
				...family.fareFeatures.exare,
				...family.fareFeatures.misc
			]}/>
		</div>;
	}
}

export default Family;
