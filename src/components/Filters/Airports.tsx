import * as React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import { Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportTab from './Airports/Tab';
import WithPopover, { State as FilterState } from './WithPopover';
import { Action, AnyAction, bindActionCreators, Dispatch } from 'redux';
import {
	getArrivalAirportsList,
	getDepartureAirportsList,
	getSelectedArrivalAirportsList,
	getSelectedArrivalAirportsObjects,
	getSelectedDepartureAirportsList,
	getSelectedDepartureAirportsObjects,
	ListOfSelectedCodes
} from '../../store/filters/selectors';
import { ApplicationState, LocationType } from '../../state';
import {
	FilterAirportsAction,
	addAirport,
	removeAirport,
	removeAllAirports
} from '../../store/filters/airports/actions';

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

interface State extends FilterState {
	activeTab: number;
}

type Props = StateProps & DispatchProps;

class Airports extends WithPopover<Props, State> {
	state: State = {
		chipLabel: '',
		isActive: false,
		isOpen: false,
		element: null,
		activeTab: 0
	};

	protected type = FilterType.Airports;
	protected label = 'Аэропорты';

	constructor(props: Props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
		this.changeTabFromSwipe = this.changeTabFromSwipe.bind(this);
		this.onArrivalChange = this.onArrivalChange.bind(this);
		this.onDepartureChange = this.onDepartureChange.bind(this);
	}

	componentWillReceiveProps({ selectedDepartureAirports, selectedArrivalAirports, selectedDepartureAirportsObject, selectedArrivalAirportsObject }: Props): void {
		const hasSelectedDepartureAirports = !!Object.keys(selectedDepartureAirports).length;
		const hasSelectedArrivalAirports = !!Object.keys(selectedArrivalAirports).length;
		let chipLabel = this.label;

		if (hasSelectedDepartureAirports) {
			chipLabel = 'Вылет: ' + selectedDepartureAirportsObject.map(airport => airport.name).join(', ');
		}

		if (hasSelectedArrivalAirports) {
			const tmpChipLabel = selectedArrivalAirportsObject.map(airport => airport.name).join(', ');

			if (hasSelectedDepartureAirports) {
				chipLabel += ', прилет: ' + tmpChipLabel;
			}
			else {
				chipLabel = 'Прилет: ' + tmpChipLabel;
			}
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

	changeTab(event: React.ChangeEvent<{}>, value: number): void {
		this.setState({
			isActive: this.state.isActive,
			isOpen: this.state.isOpen,
			element: this.state.element,
			activeTab: value
		} as State);
	}

	changeTabFromSwipe(value: number): void {
		this.setState({
			isActive: this.state.isActive,
			isOpen: this.state.isOpen,
			element: this.state.element,
			activeTab: value
		} as State);
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover-tabsSelector">
			<AppBar className="filters-filter-popover-tabsSelector-tabs" position="static" color="default">
				<Tabs
					fullWidth={true}
					value={this.state.activeTab}
					onChange={this.changeTab}
					indicatorColor="primary"
					textColor="primary"
				>
					<Tab label="Вылет" value={0}/>
					<Tab label="Прилет" value={1}/>
				</Tabs>
			</AppBar>

			<SwipeableViews
				className="filters-filter-popover-tabsSelector-content"
				index={this.state.activeTab}
				onChangeIndex={this.changeTabFromSwipe}
			>
				<AirportTab
					selectedAirports={this.props.selectedDepartureAirports}
					airports={this.props.departureAirports}
					onChange={this.onDepartureChange}
					title="Аэропорты вылета"
				/>

				<AirportTab
					selectedAirports={this.props.selectedArrivalAirports}
					airports={this.props.arrivalAirports}
					onChange={this.onArrivalChange}
					title="Аэропорты прилета"
				/>
			</SwipeableViews>
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedDepartureAirports: getSelectedDepartureAirportsList(state),
		selectedArrivalAirports: getSelectedArrivalAirportsList(state),
		selectedDepartureAirportsObject: getSelectedDepartureAirportsObjects(state),
		selectedArrivalAirportsObject: getSelectedArrivalAirportsObjects(state),
		departureAirports: getDepartureAirportsList(state),
		arrivalAirports: getArrivalAirportsList(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirport: bindActionCreators(addAirport, dispatch),
		removeAirport: bindActionCreators(removeAirport, dispatch),
		removeAllAirports: bindActionCreators(removeAllAirports, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Airports);
