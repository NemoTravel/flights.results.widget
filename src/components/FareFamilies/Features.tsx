import * as React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import CheckCircle from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Clear';
import MonetizationOn from '@material-ui/icons/AttachMoney';

import FareFamilyFeature, { FeaturePayment } from '../../schemas/FareFamilyFeature';

const paymentIcons = {
	[FeaturePayment.Free]: <CheckCircle/>,
	[FeaturePayment.Charge]: <MonetizationOn/>,
	[FeaturePayment.NotAvailable]: <Cancel/>
};

interface Props {
	features: FareFamilyFeature[];
}

class Features extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.features.length !== nextProps.features.length;
	}

	render(): React.ReactNode {
		const { features } = this.props;

		return <div className="fareFamilies-leg-segment-family__features">
			{features.map((feature, index) => (
				<div key={index} className="fareFamilies-leg-segment-family-feature">
					<Tooltip title={feature.description} placement="top">
						<span className="fareFamilies-leg-segment-family-feature__wrapper">
							<span className={`fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_${feature.needToPay}`}>
								{paymentIcons[feature.needToPay]}
							</span>

							<span className="fareFamilies-leg-segment-family-feature__name">
								{feature.showTitle ? feature.title + ' — ' : ''}{feature.value}
							</span>
						</span>
					</Tooltip>
				</div>
			))}
		</div>;
	}
}

export default Features;
