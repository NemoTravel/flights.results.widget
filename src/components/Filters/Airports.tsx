import * as React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import { Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportTab from './Airports/Tab';
import WithPopover, { State as FilterState } from './WithPopover';
import { ApplicationState } from '../../main';
import { getArrivalAirportsList, getDepartureAirportsList } from '../../store/selectors';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import {
	FilterAirlinesAction,
	addArrivalAirport,
	addDepartureAirport,
	removeArrivalAirport,
	removeDepartureAirport
} from '../../store/filters/actions';

interface StateProps {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

interface DispatchProps {
	addDepartureAirport: (IATA: string) => FilterAirlinesAction;
	removeDepartureAirport: (IATA: string) => FilterAirlinesAction;
	addArrivalAirport: (IATA: string) => FilterAirlinesAction;
	removeArrivalAirport: (IATA: string) => FilterAirlinesAction;
}

interface State extends FilterState {
	activeTab: number;
}

type Props = StateProps & DispatchProps;

class Airports extends WithPopover<Props, State> {
	state: State = {
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

	onDepartureChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addDepartureAirport(airlineCode);
		}
		else {
			this.props.removeDepartureAirport(airlineCode);
		}
	}

	onArrivalChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const airlineCode = (event.target as HTMLInputElement).value;

		if (checked) {
			this.props.addArrivalAirport(airlineCode);
		}
		else {
			this.props.removeArrivalAirport(airlineCode);
		}
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
				<AirportTab airports={this.props.departureAirports} onChange={this.onDepartureChange} title="Аэропорты вылета"/>
				<AirportTab airports={this.props.arrivalAirports} onChange={this.onArrivalChange} title="Аэропорты прилета"/>
			</SwipeableViews>
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		departureAirports: getDepartureAirportsList(state),
		arrivalAirports: getArrivalAirportsList(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addDepartureAirport: bindActionCreators(addDepartureAirport, dispatch),
		removeDepartureAirport: bindActionCreators(removeDepartureAirport, dispatch),
		addArrivalAirport: bindActionCreators(addArrivalAirport, dispatch),
		removeArrivalAirport: bindActionCreators(removeArrivalAirport, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Airports);
