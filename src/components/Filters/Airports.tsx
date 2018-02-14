import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import { Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportTab from './Airports/Tab';
import WithPopover, { State as FilterState } from './WithPopover';

interface Props {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

interface State extends FilterState {
	activeTab: number;
}

class Airports extends WithPopover<Props, State> {
	state: State = {
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
	}

	changeTab(event: React.ChangeEvent<{}>, value: number): void {
		this.setState({
			activeTab: value
		} as Partial<State>);
	}

	changeTabFromSwipe(value: number): void {
		this.setState({
			activeTab: value
		} as Partial<State>);
	}

	onPopoverClose(): void {
		this.setState({
			activeTab: 0
		} as Partial<State>);
	}

	renderPopover(): React.ReactNode {
		return <div className="filters-filter-popover-tabsSelector">
			<AppBar className="filters-filter-popover-tabsSelector-tabs" position="static" color="default">
				<Tabs fullWidth={true} value={this.state.activeTab} onChange={this.changeTab} indicatorColor="primary" textColor="primary">
					<Tab label="Туда" value={0}/>
					<Tab label="Обратно" value={1}/>
				</Tabs>
			</AppBar>

			<SwipeableViews className="filters-filter-popover-tabsSelector-content" index={this.state.activeTab} onChangeIndex={this.changeTabFromSwipe}>
				<AirportTab airports={this.props.departureAirports} title="Аэропорты вылета"/>
				<AirportTab airports={this.props.arrivalAirports} title="Аэропорты прилета"/>
			</SwipeableViews>
		</div>;
	}
}

export default Airports;
