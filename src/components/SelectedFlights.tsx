import * as React from 'react';
import Typography from '@material-ui/core/Typography';

import FlightModel from '../models/Flight';
import Flight from './Flight';

interface Props {
	selectedFlights: FlightModel[];
}

class SelectedFlights extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.selectedFlights !== this.props.selectedFlights;
	}

	render(): React.ReactNode {
		const { selectedFlights } = this.props;

		return selectedFlights.length ? (
			<div className="results-selectedFlights">
				<div className="results-selectedFlights__title">
					<Typography variant="headline">Выбранные перелеты</Typography>
				</div>

				<div className="results-selectedFlights__list">
					{selectedFlights.map(flight => (
						<Flight key={flight.id} flight={flight}/>
					))}
				</div>
			</div>
		) : null;
	}
}

export default SelectedFlights;
