import * as React from 'react';
import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import TimeFilter from './Filters/Time';
import Flight from './Flight';

class Main extends React.Component {
	render(): React.ReactNode {
		return <div className="results-wrapper">
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

export default Main;
