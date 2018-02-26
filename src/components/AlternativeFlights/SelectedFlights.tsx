import * as React from 'react';
import Typography from 'material-ui/Typography';
import Flight from '../../schemas/Flight';
import FlightComponent from '../Flight';

interface Props {
	flights: Flight[];
}

class SelectedFlights extends React.Component<Props> {
	render(): React.ReactNode {
		return <div>
			<Typography className="fareFamilies-title" variant="display1">Выбранные перелеты</Typography>

			{this.props.flights.map(flight => <div key={flight.id} className="flight__holder">
				<FlightComponent
					flight={flight}
					infoOnly={true}
				/>
			</div>)}
		</div>;
	}
}

export default SelectedFlights;
