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
import { getAirlinesList } from '../store/selectors';

interface Props {
	isLoading: boolean;
	airlines: Airline[];
	flights: FlightModel[];
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
					<AirportsFilter/>
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
		airlines: getAirlinesList(state)
	};
};

export default connect(mapStateToProps)(Main);
