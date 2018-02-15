import * as React from 'react';
import { connect } from 'react-redux';
import { FormLabel, FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';

import Airline from '../../schemas/Airline';
import { Type as FilterType } from '../Filter';
import { addAirline, removeAirline, removeAllAirlines, FilterAirlinesAction } from '../../store/filters/actions';
import { Action, AnyAction, bindActionCreators, Dispatch } from 'redux';
import WithPopover from './WithPopover';
import {
	getAirlinesList, getSelectedAirlinesList, getSelectedAirlinesObjects,
	ListOfSelectedCodes
} from '../../store/filters/selectors';
import { ApplicationState } from '../../state';

interface StateProps {
	airlines: Airline[];
	selectedAirlines: ListOfSelectedCodes;
	selectedAirlinesObject: Airline[];
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	removeAirline: (IATA: string) => FilterAirlinesAction;
	removeAllAirlines: () => Action;
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

	onClear(): void {
		this.props.removeAllAirlines();
	}

	componentWillReceiveProps({ selectedAirlines, selectedAirlinesObject }: Props): void {
		const hasSelectedAirlines = !!Object.keys(selectedAirlines).length;

		this.setState({
			isActive: hasSelectedAirlines,
			chipLabel: hasSelectedAirlines ? selectedAirlinesObject.map((airline: Airline): string => airline.name).join(', ') : this.label
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
		selectedAirlines: getSelectedAirlinesList(state),
		selectedAirlinesObject: getSelectedAirlinesObjects(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		removeAirline: bindActionCreators(removeAirline, dispatch),
		removeAllAirlines: bindActionCreators(removeAllAirlines, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Airlines);
