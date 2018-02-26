import * as React from 'react';
import Typography from 'material-ui/Typography';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';
import { SelectedFamiliesAction } from '../../store/alternativeFlights/selectedFamilies/actions';

interface Props {
	segmentId: number;
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	selectedFamilyId: number;
}

class Segment extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onFamilySelect = this.onFamilySelect.bind(this);
	}

	onFamilySelect(event: React.ChangeEvent<{}>): void {
		const inputValue = (event.target as HTMLInputElement).value;
		const inputParts = inputValue.split('_');

		this.props.selectFamily(parseInt(inputParts[0]), parseInt(inputParts[1]));
	}

	render(): React.ReactNode {
		const { selectedFamilyId, segmentId } = this.props;

		return <div className="fareFamilies-leg-segment">
			<Typography className="fareFamilies-leg-segment__title" variant="headline">
				Саратов &mdash; Москва, 24 июня
			</Typography>

			<div className="fareFamilies-leg-segment__families">
				<div className="fareFamilies-leg-segment-family">
					<div className="fareFamilies-leg-segment-family__name">
						<FormControlLabel onChange={this.onFamilySelect} checked={selectedFamilyId === 0} name="family_0" value={`${segmentId}_0`} control={<Radio color="primary"/>} label="Легкий"/>
					</div>

					<div className="fareFamilies-leg-segment-family__features">
						<div className="fareFamilies-leg-segment-family-feature">
							<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
								<CheckCircle/>
							</span>

							<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
						</div>
					</div>
				</div>

				<div className="fareFamilies-leg-segment-family">
					<div className="fareFamilies-leg-segment-family__name">
						<FormControlLabel onChange={this.onFamilySelect} checked={selectedFamilyId === 1} name="family_0" value={`${segmentId}_1`} control={<Radio color="primary"/>} label="Стандартный"/>
					</div>

					<div className="fareFamilies-leg-segment-family__features">
						<div className="fareFamilies-leg-segment-family-feature">
							<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_NotAvailable">
								<Cancel/>
							</span>

							<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
						</div>
					</div>
				</div>

				<div className="fareFamilies-leg-segment-family">
					<div className="fareFamilies-leg-segment-family__name">
						<FormControlLabel onChange={this.onFamilySelect} checked={selectedFamilyId === 2} name="family_0" value={`${segmentId}_2`} control={<Radio color="primary"/>} label="Гибкий"/>
					</div>

					<div className="fareFamilies-leg-segment-family__features">
						<div className="fareFamilies-leg-segment-family-feature">
							<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_NeedToPay">
								<MonetizationOn/>
							</span>

							<span className="fareFamilies-leg-segment-family-feature__name">Какая-то фича</span>
						</div>
					</div>
				</div>
			</div>
		</div>;
	}
}

export default Segment;
