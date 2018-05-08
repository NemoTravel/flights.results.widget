import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../models/Flight';
import SelectedFlight from './SelectedFlight';
import { LegAction } from '../../store/currentLeg/actions';

interface Props {
	flights: Flight[];
	goToLeg: (legId: number) => LegAction;
}

class SelectedFlights extends React.Component<Props> {
	render(): React.ReactNode {
		return <div className="fareFamilies-selectedFlights">
			<Typography className="fareFamilies-selectedFlights-title" variant="headline">Выбранные перелеты</Typography>

			{this.props.flights.map((flight, legId) => <div key={flight.id} className="flight__holder">
				<SelectedFlight flight={flight} currentLegId={legId} goToLeg={this.props.goToLeg}/>
			</div>)}
		</div>;
	}
}

export default SelectedFlights;
