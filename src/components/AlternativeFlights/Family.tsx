import * as React from 'react';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';

import FareFamily from '../../schemas/FareFamily';

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
		const { family, id } = this.props;

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
				<div className="fareFamilies-leg-segment-family-feature">
					<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
						<CheckCircle/>
					</span>

					<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
				</div>
				<div className="fareFamilies-leg-segment-family-feature">
					<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
						<CheckCircle/>
					</span>

					<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
				</div>
				<div className="fareFamilies-leg-segment-family-feature">
					<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
						<CheckCircle/>
					</span>

					<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
				</div>
				<div className="fareFamilies-leg-segment-family-feature">
					<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
						<CheckCircle/>
					</span>

					<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
				</div>
			</div>
		</div>;
	}
}

export default Family;
