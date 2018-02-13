import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import { ApplicationState } from '../main';
import FlightModel from '../schemas/Flight';
import Airline from '../schemas/Airline';
import { getAirlinesList, getArrivalAirportsList, getDepartureAirportsList } from '../store/selectors';
import Airport from '../schemas/Airport';

interface Props {
	isLoading: boolean;
	airlines: Airline[];
	flights: FlightModel[];
	departureAirports: Airport[];
	arrivalAirports: Airport[];
}

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		return this.props.isLoading ?
			<LinearProgress color="secondary" variant="query"/> :
			<div className="results-wrapper">
				<section className="scenarios">

				</section>

				<section className="filters">
					<AirlineFilter airlines={this.props.airlines}/>
					<AirportsFilter departureAirports={this.props.departureAirports} arrivalAirports={this.props.arrivalAirports}/>
					<TimeFilter/>
				</section>

				<section className="results">
					{this.props.flights.map((flight, index) => <Flight key={index} flight={flight}/>)}
				</section>
			</div>;
	}
}

const mapStateToProps = (state: ApplicationState): Props => {
	return {
		isLoading: state.isLoading,
		flights: state.flights,
		airlines: getAirlinesList(state),
		departureAirports: getDepartureAirportsList(state),
		arrivalAirports: getArrivalAirportsList(state)
	};
};

export default connect(mapStateToProps)(Main);
