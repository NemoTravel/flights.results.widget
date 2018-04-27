import * as React from 'react';
import { connect } from 'react-redux';

import { Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportColumn from './Airports/Column';
import WithPopover, { State as FilterState } from './WithPopover';
import { Action, AnyAction, bindActionCreators, Dispatch } from 'redux';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { ApplicationState, LocationType } from '../../state';
import {
	FilterAirportsAction,
	addAirport,
	removeAirport,
	removeAllAirports
} from '../../store/filters/airports/actions';
import {
	getArrivalAirports,
	getDepartureAirports,
	getSelectedArrivalAirportsList,
	getSelectedArrivalAirportsObjects,
	getSelectedDepartureAirportsList,
	getSelectedDepartureAirportsObjects
} from '../../store/filters/airports/selectors';

interface StateProps {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
	selectedDepartureAirports: ListOfSelectedCodes;
	selectedArrivalAirports: ListOfSelectedCodes;
	selectedDepartureAirportsObject: Airport[];
	selectedArrivalAirportsObject: Airport[];
}

interface DispatchProps {
	addAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	removeAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	removeAllAirports: () => Action;
}

type Props = StateProps & DispatchProps;

class Airports extends WithPopover<Props, FilterState> {
	protected type = FilterType.Airports;
	protected label = 'Аэропорты';

	constructor(props: Props) {
		super(props);

		this.onArrivalChange = this.onArrivalChange.bind(this);
		this.onDepartureChange = this.onDepartureChange.bind(this);
	}

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.departureAirports !== nextProps.departureAirports ||
			this.props.arrivalAirports !== nextProps.arrivalAirports ||
			this.props.selectedDepartureAirports !== nextProps.selectedArrivalAirports ||
			this.props.selectedDepartureAirportsObject !== nextProps.selectedDepartureAirportsObject ||
			this.props.selectedArrivalAirportsObject !== nextProps.selectedArrivalAirportsObject ||
			this.state.isOpen !== nextState.isOpen ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentWillReceiveProps({ selectedDepartureAirports, selectedArrivalAirports, selectedDepartureAirportsObject, selectedArrivalAirportsObject }: Props): void {
		const hasSelectedDepartureAirports = !!Object.keys(selectedDepartureAirports).length;
		const hasSelectedArrivalAirports = !!Object.keys(selectedArrivalAirports).length;
		let chipLabel = this.label;

		if (hasSelectedDepartureAirports) {
			chipLabel = 'Вылет: ' + selectedDepartureAirportsObject.map(airport => airport.name).join(', ');
		}

		if (hasSelectedArrivalAirports) {
			chipLabel = `${hasSelectedDepartureAirports ? chipLabel + ', ' : ''}Прилет: ${selectedArrivalAirportsObject.map(airport => airport.name).join(', ')}`;
		}

		this.setState({
			isActive: hasSelectedDepartureAirports || hasSelectedArrivalAirports,
			chipLabel: chipLabel
		});
	}

	onDepartureChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addAirport(airlineCode, LocationType.Departure);
		}
		else {
			this.props.removeAirport(airlineCode, LocationType.Departure);
		}
	}

	onArrivalChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addAirport(airlineCode, LocationType.Arrival);
		}
		else {
			this.props.removeAirport(airlineCode, LocationType.Arrival);
		}
	}

	onClear(): void {
		this.props.removeAllAirports();
	}

	isVisible(): boolean {
		return this.props.departureAirports.length > 1 || this.props.arrivalAirports.length > 1;
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover__columns">
			{this.props.departureAirports.length > 1 ? (
				<AirportColumn
					selectedAirports={this.props.selectedDepartureAirports}
					airports={this.props.departureAirports}
					onChange={this.onDepartureChange}
					title="Аэропорты вылета"
				/>
			) : null}

			{this.props.arrivalAirports.length > 1 ? (
				<AirportColumn
					selectedAirports={this.props.selectedArrivalAirports}
					airports={this.props.arrivalAirports}
					onChange={this.onArrivalChange}
					title="Аэропорты прилета"
				/>
			) : null}
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedDepartureAirports: getSelectedDepartureAirportsList(state),
		selectedArrivalAirports: getSelectedArrivalAirportsList(state),
		selectedDepartureAirportsObject: getSelectedDepartureAirportsObjects(state),
		selectedArrivalAirportsObject: getSelectedArrivalAirportsObjects(state),
		departureAirports: getDepartureAirports(state),
		arrivalAirports: getArrivalAirports(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction, any>): DispatchProps => {
	return {
		addAirport: bindActionCreators(addAirport, dispatch),
		removeAirport: bindActionCreators(removeAirport, dispatch),
		removeAllAirports: bindActionCreators(removeAllAirports, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Airports);
