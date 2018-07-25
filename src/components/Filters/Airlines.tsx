import * as React from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Airline from '../../schemas/Airline';
import Column from './Airlines/Column';
import { Type as FilterType } from '../Filter';
import WithPopover, { State as WithPopoverState } from './WithPopover';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { RootState } from '../../store/reducers';
import { addAirline, removeAirline, removeAllAirlines } from '../../store/filters/airlines/actions';
import { getAllAirlines, getSelectedAirlinesObjects } from '../../store/filters/airlines/selectors';
import { getSelectedAirlinesList } from '../../store/selectors';
import { i18n } from '../../i18n';

interface OwnProps {
	handleMobileClick?: () => void;
}

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

type Props = StateProps & DispatchProps & OwnProps;

class Airlines extends WithPopover<Props, WithPopoverState> {
	protected type = FilterType.Airlines;
	protected label = i18n('filters-airlines-title');

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
			this.state.chipLabel !== nextState.chipLabel ||
			this.state.isFullScreenOpen !== nextState.isFullScreenOpen;
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

	componentDidMount(): void {
		const { selectedAirlines, selectedAirlinesObject } = this.props;

		this.updateState(selectedAirlines, selectedAirlinesObject);
	}

	componentWillReceiveProps({ selectedAirlines, selectedAirlinesObject }: Props): void {
		this.updateState(selectedAirlines, selectedAirlinesObject);
	}

	updateState(selectedAirlines: ListOfSelectedCodes, selectedAirlinesObject: Airline[]): void {
		const hasSelectedAirlines = !!Object.keys(selectedAirlines).length;

		this.setState({
			isActive: hasSelectedAirlines,
			chipLabel: hasSelectedAirlines ? selectedAirlinesObject.map((airline: Airline): string => airline.name).join(', ') : this.label
		});
	}

	isVisible(): boolean {
		return this.props.airlines.length > 1;
	}

	onMobileClick(): void {
		this.props.handleMobileClick();
	}

	renderPopover(): React.ReactNode {
		const firstColumnLength = Math.round(this.props.airlines.length / 2);

		return <div className="filters-filter-popover__columns">
			<FormControl component="fieldset">
				<FormLabel className="filters-filter-popover-legend" component="legend">
					{this.label}
				</FormLabel>

				<div className="filters-filter-popover__columns">
					<Column
						airlines={this.props.airlines.slice(0, firstColumnLength)}
						selectedAirlines={this.props.selectedAirlines}
						onChange={this.onChange}
					/>

					<Column
						airlines={this.props.airlines.slice(firstColumnLength)}
						selectedAirlines={this.props.selectedAirlines}
						onChange={this.onChange}
					/>
				</div>
			</FormControl>
		</div>;
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
