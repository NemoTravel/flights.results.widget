import * as React from 'react';
import * as classnames from 'classnames';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';
import Tooltip from 'material-ui/Tooltip';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';

import FareFamily from '../../schemas/FareFamily';
import FareFamilyFeature, { FeaturePayment } from '../../schemas/FareFamilyFeature';
import Money from '../../schemas/Money';
import Price from '../Price';

const paymentIcons = {
	[FeaturePayment.Free]: <CheckCircle/>,
	[FeaturePayment.Charge]: <MonetizationOn/>,
	[FeaturePayment.NotAvailable]: <Cancel/>
};

interface Props {
	id: string;
	family: FareFamily;
	isSelected: boolean;
	isDisabled: boolean;
	onChange: (familyId: string) => void;
	price: Money;
}

class Family extends React.Component<Props> {
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
		const allFareFeatures: FareFamilyFeature[] = [
			...family.fareFeatures.baggage,
			...family.fareFeatures.exare,
			...family.fareFeatures.misc
		];

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

			<div className="fareFamilies-leg-segment-family__features">
				{allFareFeatures.map((feature, index) => (
					<Tooltip key={index} className="fareFamilies-leg-segment-family-feature__tooltip" title={feature.description} placement="top">
						<div className="fareFamilies-leg-segment-family-feature">
							<span className={`fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_${feature.needToPay}`}>
								{paymentIcons[feature.needToPay]}
							</span>

							<span className="fareFamilies-leg-segment-family-feature__name">
								{feature.showTitle ? feature.title + ' — ' : ''}{feature.value}
							</span>
						</div>
					</Tooltip>
				))}
			</div>
		</div>;
	}
}

export default Family;
