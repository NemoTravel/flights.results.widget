import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import Filter, { State as FilterState, Type as FilterType } from '../Filter';
import Airport from '../../schemas/Airport';

enum TabType {
	Departure,
	Arrival
}

interface Props {
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

interface State extends FilterState {
	activeTab: TabType;
}

class Airports extends Filter<Props, State> {
	state: State = {
		isOpen: false,
		element: null,
		activeTab: TabType.Departure
	};

	protected type = FilterType.Airports;
	protected label = 'Аэропорты';

	constructor(props: Props) {
		super(props);

		this.changeTab = this.changeTab.bind(this);
	}

	changeTab(event: React.ChangeEvent<{}>, value: TabType): void {
		this.setState({
			activeTab: value
		} as Partial<State>);
	}

	renderPopover(): React.ReactNode {
		return <div>
			<AppBar position="static" color="default">
				<Tabs value={this.state.activeTab} onChange={this.changeTab} indicatorColor="primary" textColor="primary">
					<Tab label="Туда" value={TabType.Departure}/>
					<Tab label="Обратно" value={TabType.Arrival}/>
				</Tabs>
			</AppBar>
		</div>;
	}
}

export default Airports;
