import * as React from 'react';
import { connect } from 'react-redux';

import { Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportColumn from './Airports/Column';
import WithPopover, { State as FilterState } from './WithPopover';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import { RootState } from '../../store/reducers';
import {
	addAirport,
	removeAirport,
	removeAllAirports
} from '../../store/filters/airports/actions';
import {
	getArrivalAirports,
	getDepartureAirports,
	getSelectedArrivalAirportsObjects,
	getSelectedDepartureAirportsObjects
} from '../../store/filters/airports/selectors';
import { getSelectedArrivalAirportsList, getSelectedDepartureAirportsList } from '../../store/selectors';
import { LocationType } from '../../enums';
import { i18n } from '../../i18n';

interface OwnProps {
	handleMobileClick?: () => void;
}

interface StateProps {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
	selectedDepartureAirports: ListOfSelectedCodes;
	selectedArrivalAirports: ListOfSelectedCodes;
	selectedDepartureAirportsObject: Airport[];
	selectedArrivalAirportsObject: Airport[];
}

interface DispatchProps {
	addAirport: typeof addAirport;
	removeAirport: typeof removeAirport;
	removeAllAirports: typeof removeAllAirports;
}

type Props = StateProps & DispatchProps & OwnProps;

class Airports extends WithPopover<Props, FilterState> {
	protected type = FilterType.Airports;
	protected label = i18n('filters-airports-title');

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
			this.state.chipLabel !== nextState.chipLabel ||
			this.state.isFullScreenOpen !== nextState.isFullScreenOpen;
	}

	componentWillReceiveProps({ selectedDepartureAirports, selectedArrivalAirports, selectedDepartureAirportsObject, selectedArrivalAirportsObject }: Props): void {
		const hasSelectedDepartureAirports = !!Object.keys(selectedDepartureAirports).length;
		const hasSelectedArrivalAirports = !!Object.keys(selectedArrivalAirports).length;
		let chipLabel = this.label;

		if (hasSelectedDepartureAirports) {
			chipLabel = `${i18n('filters-departureTitle')}: ${selectedDepartureAirportsObject.map(airport => airport.name).join(', ')}`;
		}

		if (hasSelectedArrivalAirports) {
			if (hasSelectedDepartureAirports) {
				chipLabel = `${chipLabel}, ${i18n('filters-arrivalTitle_lowercase')}`;
			}
			else {
				chipLabel = `${i18n('filters-arrivalTitle')}`;
			}

			chipLabel += `: ${selectedArrivalAirportsObject.map(airport => airport.name).join(', ')}`;
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

	onMobileClick(): void {
		this.props.handleMobileClick();
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover__columns">
			{this.props.departureAirports.length > 1 ? (
				<AirportColumn
					selectedAirports={this.props.selectedDepartureAirports}
					airports={this.props.departureAirports}
					onChange={this.onDepartureChange}
					title={i18n('filters-airports-departureCol-title')}
				/>
			) : null}

			{this.props.arrivalAirports.length > 1 ? (
				<AirportColumn
					selectedAirports={this.props.selectedArrivalAirports}
					airports={this.props.arrivalAirports}
					onChange={this.onArrivalChange}
					title={i18n('filters-airports-arrivalCol-title')}
				/>
			) : null}
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		selectedDepartureAirports: getSelectedDepartureAirportsList(state),
		selectedArrivalAirports: getSelectedArrivalAirportsList(state),
		selectedDepartureAirportsObject: getSelectedDepartureAirportsObjects(state),
		selectedArrivalAirportsObject: getSelectedArrivalAirportsObjects(state),
		departureAirports: getDepartureAirports(state),
		arrivalAirports: getArrivalAirports(state)
	};
};

const mapDispatchToProps = {
	addAirport,
	removeAirport,
	removeAllAirports
};

export default connect(mapStateToProps, mapDispatchToProps)(Airports);
