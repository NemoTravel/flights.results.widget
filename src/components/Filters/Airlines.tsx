import * as React from 'react';
import { connect } from 'react-redux';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import Airline from '../../schemas/Airline';
import { Type as FilterType } from '../Filter';
import { addAirline, FilterAirlinesAction, removeAirline } from '../../store/filters/actions';
import { getAirlinesList, getSelectedAirlinesList, ListOfSelectedCodes } from '../../store/selectors';
import { ApplicationState } from '../../main';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import WithPopover from './WithPopover';

interface StateProps {
	airlines: Airline[];
	selectedAirlines: ListOfSelectedCodes;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	removeAirline: (IATA: string) => FilterAirlinesAction;
}

type Props = StateProps & DispatchProps;

class Airlines extends WithPopover<Props, any> {
	protected type = FilterType.Airlines;
	protected label = 'Авиакомпании';

	constructor(props: Props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	onChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addAirline(airlineCode);
		}
		else {
			this.props.removeAirline(airlineCode);
		}
	}

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: !!Object.keys(props.selectedAirlines).length
		});
	}

	renderPopover(): React.ReactNode {
		return <FormControl component="fieldset">
			<FormLabel className="filters-filter-popover-legend" component="legend">
				{this.label}
			</FormLabel>

			<FormGroup>
				{this.props.airlines.map((airline, index) => (
					<FormControlLabel
						key={index}
						control={
							<Checkbox
								onChange={this.onChange}
								checked={airline.IATA in this.props.selectedAirlines}
								value={airline.IATA}
							/>
						}
						label={airline.name}
					/>
				))}
			</FormGroup>
		</FormControl>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		airlines: getAirlinesList(state),
		selectedAirlines: getSelectedAirlinesList(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		removeAirline: bindActionCreators(removeAirline, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Airlines);
