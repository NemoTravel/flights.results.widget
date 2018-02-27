import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../schemas/Flight';
import SelectedFlight from './SelectedFlight';

interface Props {
	flights: Flight[];
}

class SelectedFlights extends React.Component<Props> {
	render(): React.ReactNode {
		return <div className="fareFamilies-selectedFlights">
			<Typography className="fareFamilies-selectedFlights-title" variant="display1">Выбранные перелеты</Typography>

			{this.props.flights.map(flight => <div key={flight.id} className="flight__holder">
				<SelectedFlight flight={flight} />
			</div>)}
		</div>;
	}
}

export default SelectedFlights;
