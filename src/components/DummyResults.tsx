import * as React from 'react';
import Flight from './Dummy/Flight';

const DUMMY_FLIGHTS_COUNT = 8;

class DummyResults extends React.Component {
	renderDummyFlights(): React.ReactNode {
		const array = new Array(DUMMY_FLIGHTS_COUNT);

		array.fill(1);

		return array.map((item, index) => {
			return <Flight key={index}/>;
		});
	}

	render(): React.ReactNode {
		return <div className="results__inner results-dummy">
			{this.renderDummyFlights()}
		</div>;
	}
}

export default DummyResults;
