import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import Typography from 'material-ui/Typography';
import Radio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

import CheckCircle from 'material-ui-icons/Check';
import Cancel from 'material-ui-icons/Clear';
import MonetizationOn from 'material-ui-icons/AttachMoney';

import { searchForAlternativeFlights } from '../store/actions';
import { CommonThunkAction } from '../state';
import { SelectedFamiliesAction, selectFamily } from '../store/alternativeFlights/selectedFamilies/actions';

interface DispatchProps {
	selectFamily: (segmentId: number, familyId: number) => SelectedFamiliesAction;
	searchForAlternativeFlights: () => CommonThunkAction;
}

class AlternativeFlights extends React.Component<DispatchProps> {
	constructor(props: DispatchProps) {
		super(props);

		this.onFamilySelect = this.onFamilySelect.bind(this);
	}

	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	onFamilySelect(event: React.ChangeEvent<{}>): void {
		const inputValue = (event.target as HTMLInputElement).value;
		const inputParts = inputValue.split('_');

		this.props.selectFamily(parseInt(inputParts[0]), parseInt(inputParts[1]));
	}

	render(): React.ReactNode {
		const val: string = '0_1';

		return <section className="fareFamilies">
			<Typography className="fareFamilies-title" variant="display1">Выбор тарифа</Typography>

			<div className="alternativeFlights__legs">
				<div className="fareFamilies-leg">
					<div className="fareFamilies-leg__segments">
						<div className="fareFamilies-leg-segment">
							<Typography className="fareFamilies-leg-segment__title" variant="headline">
								Саратов &mdash; Москва, 24 июня
							</Typography>

							<div className="fareFamilies-leg-segment__families">
								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel onChange={this.onFamilySelect} checked={val === '0_0'} name="family_0" value="0_0" control={<Radio color="primary"/>} label="Легкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">
											<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_Free">
												<CheckCircle/>
											</span>
											Какая-то фича
										</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel onChange={this.onFamilySelect} checked={val === '0_1'} name="family_0" value="0_1" control={<Radio color="primary"/>} label="Стандартный"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">
											<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_NotAvailable">
												<Cancel/>
											</span>
											Какая-то фича
										</div>
									</div>
								</div>

								<div className="fareFamilies-leg-segment-family">
									<div className="fareFamilies-leg-segment-family__name">
										<FormControlLabel onChange={this.onFamilySelect} checked={val === '0_2'} name="family_0" value="0_2" control={<Radio color="primary"/>} label="Гибкий"/>
									</div>

									<div className="fareFamilies-leg-segment-family__features">
										<div className="fareFamilies-leg-segment-family-feature">
											<span className="fareFamilies-leg-segment-family-feature__icon fareFamilies-leg-segment-family-feature__icon_NeedToPay">
												<MonetizationOn/>
											</span>
											Какая-то фича
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>;
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFamily: bindActionCreators(selectFamily, dispatch),
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch)
	};
};

export default connect(null, mapDispatchToProps)(AlternativeFlights);
