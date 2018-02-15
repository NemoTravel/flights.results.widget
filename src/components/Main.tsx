import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import { ApplicationState } from '../main';
import FlightModel from '../schemas/Flight';
import { getVisibleFlights } from '../store/selectors';

interface StateProps {
	isLoading: boolean;
	flights: FlightModel[];
}

class Main extends React.Component<StateProps> {
	render(): React.ReactNode {
		return this.props.isLoading ?
			<LinearProgress className="results-loader" color="secondary" variant="query"/> :
			<div className="results-wrapper">
				<section className="scenarios">

				</section>

				<section className="filters">
					<DirectOnlyFilter/>
					<AirlineFilter/>
					<AirportsFilter/>
					<TimeFilter/>
				</section>

				<section className="results">
					{this.props.flights.map((flight, index) => <Flight key={index} flight={flight}/>)}
				</section>
			</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		flights: getVisibleFlights(state)
	};
};

export default connect(mapStateToProps)(Main);
