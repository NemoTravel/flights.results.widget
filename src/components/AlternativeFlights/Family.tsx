import * as React from 'react';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';
import Tooltip from 'material-ui/Tooltip';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';

import FareFamily from '../../schemas/FareFamily';
import FareFamilyFeature, { FeaturePayment } from '../../schemas/FareFamilyFeature';

const paymentIcons = {
	[FeaturePayment.Free]: <CheckCircle/>,
	[FeaturePayment.Charge]: <MonetizationOn/>,
	[FeaturePayment.NotAvailable]: <Cancel/>
};

interface Props {
	id: number;
	family: FareFamily;
	isSelected: boolean;
	selectFamily: (familyId: number) => void;
}

class Family extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onFamilySelect = this.onFamilySelect.bind(this);
	}

	onFamilySelect(event: React.ChangeEvent<{}>): void {
		const inputValue = (event.target as HTMLInputElement).value;

		this.props.selectFamily(parseInt(inputValue));
	}

	render() {
		const { id, family } = this.props;
		const allFareFeatures: FareFamilyFeature[] = [
			...family.fareFeatures.baggage,
			...family.fareFeatures.exare,
			...family.fareFeatures.misc
		];

		return <div className="fareFamilies-leg-segment-family">
			<div className="fareFamilies-leg-segment-family__name">
				<FormControlLabel
					name="family"
					label={family.fareFamilyName}
					checked={this.props.isSelected}
					value={id.toString()}
					control={<Radio color="primary"/>}
					onChange={this.onFamilySelect}
				/>
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
