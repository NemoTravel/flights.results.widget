import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../models/Flight';
import SelectedFlight from './SelectedFlight';
import { goToLeg } from '../../store/currentLeg/actions';

interface Props {
	flights: Flight[];
	goToLeg: typeof goToLeg;
}

const filterFlights = (flights: Flight[]): Flight[] => {
	const map: { [flightId: number]: boolean } = {};

	return flights.filter(flight => {
		if (map.hasOwnProperty(flight.id)) {
			return false;
		}

		map[flight.id] = true;

		return true;
	});
};

class SelectedFlights extends React.Component<Props> {
	render(): React.ReactNode {
		return <div className="fareFamilies-selectedFlights">
			<Typography className="fareFamilies-selectedFlights-title" variant="headline">Выбранные перелеты</Typography>

			{filterFlights(this.props.flights).map((flight, legId) => (
				<SelectedFlight key={flight.id} flight={flight} currentLegId={legId} goToLeg={this.props.goToLeg}/>
			))}
		</div>;
	}
}

export default SelectedFlights;
