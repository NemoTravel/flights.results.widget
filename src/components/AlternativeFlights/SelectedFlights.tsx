import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../schemas/Flight';
import SelectedFlight from './SelectedFlight';
import { CommonThunkAction } from '../../state';

interface Props {
	flights: Flight[];
	goToLeg: (legId: number) => CommonThunkAction;
}

class SelectedFlights extends React.Component<Props> {
	// shouldComponentUpdate(): boolean {
	// 	return false;
	// }

	render(): React.ReactNode {
		return <div className="fareFamilies-selectedFlights">
			<Typography className="fareFamilies-selectedFlights-title" variant="display1">Выбранные перелеты</Typography>

			{this.props.flights.map((flight, legId) => <div key={flight.id} className="flight__holder">
				<SelectedFlight flight={flight} currentLegId={legId} goToLeg={this.props.goToLeg}/>
			</div>)}
		</div>;
	}
}

export default SelectedFlights;
