import * as React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import TimeTab from './Time/Tab';
import { Type as FilterType } from '../Filter';
import WithPopover, { State as FilterState } from './WithPopover';
import { ApplicationState, FlightTimeType, LocationType } from '../../state';
import { Action, AnyAction, bindActionCreators, Dispatch } from 'redux';
import { ListOfSelectedCodes } from '../../store/filters/selectors';
import {
	getArrivalAirports, getDepartureAirports, getSelectedArrivalAirportsList,
	getSelectedArrivalAirportsObjects, getSelectedDepartureAirportsList, getSelectedDepartureAirportsObjects
} from '../../store/filters/airports/selectors';
import { FilterTimeAction, addTimeInterval, removeAllTimeIntervals, removeTimeInterval } from '../../store/filters/time/actions';
import { getSelectedArrivalTimeIntervals, getSelectedDepartureTimeIntervals } from '../../store/filters/time/selectors';

interface StateProps {
	selectedDepartureTimeIntervals: ListOfSelectedCodes;
	selectedArrivalTimeIntervals: ListOfSelectedCodes;
}

interface DispatchProps {
	addTimeInterval: (time: FlightTimeType, type: LocationType) => FilterTimeAction;
	removeTimeInterval: (time: FlightTimeType, type: LocationType) => FilterTimeAction;
	removeAllTimeIntervals: () => Action;
}

interface State extends FilterState {
	activeTab: number;
}

type Props = StateProps & DispatchProps;

class Time extends WithPopover<Props, State> {
	state: State = {
		chipLabel: '',
		isActive: false,
		isOpen: false,
		element: null,
		activeTab: 0
	};

	protected type = FilterType.Time;
	protected label = 'Время';

	constructor(props: Props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
		this.changeTabFromSwipe = this.changeTabFromSwipe.bind(this);
		this.onArrivalChange = this.onArrivalChange.bind(this);
		this.onDepartureChange = this.onDepartureChange.bind(this);
	}

	onDepartureChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const timeInterval = (event.target as HTMLInputElement).value as FlightTimeType;

		if (checked) {
			this.props.addTimeInterval(timeInterval, LocationType.Departure);
		}
		else {
			this.props.removeTimeInterval(timeInterval, LocationType.Departure);
		}
	}

	onArrivalChange(event: React.FormEvent<HTMLInputElement>, checked: boolean): void {
		const timeInterval = (event.target as HTMLInputElement).value as FlightTimeType;

		if (checked) {
			this.props.addTimeInterval(timeInterval, LocationType.Arrival);
		}
		else {
			this.props.removeTimeInterval(timeInterval, LocationType.Arrival);
		}
	}

	onClear(): void {
		this.props.removeAllTimeIntervals();
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
				<TimeTab
					selectedTime={this.props.selectedDepartureTimeIntervals}
					onChange={this.onDepartureChange}
					title="Время вылета"
				/>

				<TimeTab
					selectedTime={this.props.selectedArrivalTimeIntervals}
					onChange={this.onArrivalChange}
					title="Время прилета"
				/>
			</SwipeableViews>
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		selectedDepartureTimeIntervals: getSelectedDepartureTimeIntervals(state),
		selectedArrivalTimeIntervals: getSelectedArrivalTimeIntervals(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addTimeInterval: bindActionCreators(addTimeInterval, dispatch),
		removeTimeInterval: bindActionCreators(removeTimeInterval, dispatch),
		removeAllTimeIntervals: bindActionCreators(removeAllTimeIntervals, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Time);
