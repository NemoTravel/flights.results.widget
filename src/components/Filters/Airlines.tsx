import * as React from 'react';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Checkbox from './Checkbox';
import Airline from '../../schemas/Airline';
import { Type as FilterType } from '../Filter';
import WithPopover, { State as WithPopoverState } from './WithPopover';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { RootState } from '../../store/reducers';
import { addAirline, removeAirline, removeAllAirlines } from '../../store/filters/airlines/actions';
import { getAllAirlines, getSelectedAirlinesObjects } from '../../store/filters/airlines/selectors';
import { getSelectedAirlinesList } from '../../store/selectors';

interface StateProps {
	airlines: Airline[];
	selectedAirlines: ListOfSelectedCodes;
	selectedAirlinesObject: Airline[];
}

interface DispatchProps {
	addAirline: typeof addAirline;
	removeAirline: typeof removeAirline;
	removeAllAirlines: typeof removeAllAirlines;
}

type Props = StateProps & DispatchProps;

class Airlines extends WithPopover<Props, WithPopoverState> {
	protected type = FilterType.Airlines;
	protected label = 'Авиакомпании';

	constructor(props: Props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	shouldComponentUpdate(nextProps: Props, nextState: WithPopoverState): boolean {
		return this.props.airlines !== nextProps.airlines ||
			this.props.selectedAirlines !== nextProps.selectedAirlines ||
			this.props.selectedAirlinesObject !== nextProps.selectedAirlinesObject ||
			this.state.isOpen !== nextState.isOpen ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
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

	isVisible(): boolean {
		return this.props.airlines.length > 1;
	}

	renderPopover(): React.ReactNode {
		return <FormControl component="fieldset">
			<FormLabel className="filters-filter-popover-legend" component="legend">
				{this.label}
			</FormLabel>

			<FormGroup className="filters-filter-popover-group">
				{this.props.airlines.map((airline, index) => (
					<Checkbox
						key={index}
						label={airline.name}
						onChange={this.onChange}
						checked={airline.IATA in this.props.selectedAirlines}
						value={airline.IATA}
					/>
				))}
			</FormGroup>
		</FormControl>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		airlines: getAllAirlines(state),
		selectedAirlines: getSelectedAirlinesList(state),
		selectedAirlinesObject: getSelectedAirlinesObjects(state)
	};
};

const mapDispatchToProps = {
	addAirline,
	removeAirline,
	removeAllAirlines
};

export default connect(mapStateToProps, mapDispatchToProps)(Airlines);
