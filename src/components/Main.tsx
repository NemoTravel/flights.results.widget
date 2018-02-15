import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import FlightModel from '../schemas/Flight';
import { getVisibleFlights } from '../store/selectors';
import { ApplicationState } from '../state';
import { List, ListRowProps, WindowScroller } from 'react-virtualized';

interface StateProps {
	isLoading: boolean;
	flights: FlightModel[];
}

class Main extends React.Component<StateProps> {
	constructor(props: StateProps) {
		super(props);

		this.flightRenderer = this.flightRenderer.bind(this);
	}

	flightRenderer({ index, isScrolling, key, style }: ListRowProps): React.ReactNode {
		return <Flight key={index} flight={this.props.flights[index]} style={style}/>;
	}

	render(): React.ReactNode {
		const numOfFlights = this.props.flights.length;
		const rowHeight = 72;

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
					<WindowScroller>
						{({ width, height, isScrolling, onChildScroll, scrollTop }) => (
							<List
								autoHeight
								isScrolling={isScrolling}
								scrollTop={scrollTop}
								height={height}
								width={width}
								rowCount={numOfFlights}
								rowHeight={rowHeight}
								rowRenderer={this.flightRenderer}
							/>
						)}
					</WindowScroller>
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
