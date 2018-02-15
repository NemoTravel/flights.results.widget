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
import { FilterAirlinesAction, addAirport, removeAirport, removeAllAirports } from '../../store/filters/actions';
import {
	getArrivalAirportsList,
	getDepartureAirportsList,
	getSelectedArrivalAirportsList, getSelectedDepartureAirportsList,
	ListOfSelectedCodes
} from '../../store/filters/selectors';
import { ApplicationState, LocationType } from '../../state';

interface StateProps {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
	selectedDepartureAirports: ListOfSelectedCodes;
	selectedArrivalAirports: ListOfSelectedCodes;
}

interface DispatchProps {
	addAirport: (IATA: string, type: LocationType) => FilterAirlinesAction;
	removeAirport: (IATA: string, type: LocationType) => FilterAirlinesAction;
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

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: !!Object.keys(props.selectedDepartureAirports).length || !!Object.keys(props.selectedArrivalAirports).length
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
