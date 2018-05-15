import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../models/Flight';
import SelectedFlight from './SelectedFlight';
import { goToLeg } from '../../store/currentLeg/actions';

interface Props {
	flights: Flight[];
	goToLeg: typeof goToLeg;
}

class SelectedFlights extends React.Component<Props> {
	render(): React.ReactNode {
		return <div className="fareFamilies-selectedFlights">
			<Typography className="fareFamilies-selectedFlights-title" variant="headline">Выбранные перелеты</Typography>

			{this.props.flights.map((flight, legId) => <SelectedFlight key={flight.id} flight={flight} currentLegId={legId} goToLeg={this.props.goToLeg}/>)}
		</div>;
	}
}

export default SelectedFlights;
