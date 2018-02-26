import * as React from 'react';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';

import { FamilyModel } from './Segment';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';

interface Props {
	segmentId: number;
	family: FamilyModel;
	isSelected: boolean;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
}

class Family extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onFamilySelect = this.onFamilySelect.bind(this);
	}

	onFamilySelect(event: React.ChangeEvent<{}>): void {
		const inputValue = (event.target as HTMLInputElement).value;

		this.props.selectFamily(this.props.segmentId, parseInt(inputValue));
	}

	render() {
		return <div className="fareFamilies-leg-segment-family">
			<div className="fareFamilies-leg-segment-family__name">
				<FormControlLabel
					onChange={this.onFamilySelect}
					checked={this.props.isSelected}
					name={`family_${this.props.segmentId}`}
					value={this.props.family.id.toString()}
					control={<Radio color="primary"/>}
					label={this.props.family.name}
				/>
			</div>

			<div className="fareFamilies-leg-segment-family__features">
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
