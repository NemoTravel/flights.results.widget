import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import { ApplicationState } from '../main';

interface Props {
	isLoading: boolean;
}

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		return this.props.isLoading ?
			<LinearProgress color="secondary" variant="query"/> :
			<div className="results-wrapper">
				<section className="scenarios">

				</section>

				<section className="filters">
					<AirlineFilter/>
					<AirportsFilter/>
					<TimeFilter/>
				</section>

				<section className="results">
					<Flight/>
					<Flight/>
					<Flight/>
					<Flight/>
				</section>
			</div>;
	}
}

const mapStateToProps = (state: ApplicationState): Props => {
	return {
		isLoading: state.isLoading
	};
};

export default connect(mapStateToProps)(Main);
