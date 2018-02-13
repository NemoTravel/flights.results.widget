import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import Filter, { State as FilterState, Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';
import AirportTab from './Airports/Tab';

interface Props {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

interface State extends FilterState {
	activeTab: number;
}

class Airports extends Filter<Props, State> {
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

	renderPopover(): React.ReactNode {
		return <div>
			<AppBar position="static" color="default">
				<Tabs value={this.state.activeTab} onChange={this.changeTab} indicatorColor="primary" textColor="primary">
					<Tab label="Туда" value={0}/>
					<Tab label="Обратно" value={1}/>
				</Tabs>
			</AppBar>

			<SwipeableViews index={this.state.activeTab} onChangeIndex={this.changeTabFromSwipe}>
				<AirportTab airports={this.props.departureAirports} title="Аэропорты вылета"/>
				<AirportTab airports={this.props.arrivalAirports} title="Аэропорты прилета"/>
			</SwipeableViews>
		</div>;
	}
}

export default Airports;
