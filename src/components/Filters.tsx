import * as React from 'react';
import Typography from 'material-ui/Typography';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import FlightNumber from './Filters/FlightNumber';
import Leg from '../schemas/Leg';

interface Props {
	currentLeg: Leg;
}

class Filters extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.currentLeg !== nextProps.currentLeg;
	}

	render(): React.ReactNode {
		const { currentLeg } = this.props;

		return <section className="filters">
			<div className="filters__left">
				<Typography variant="headline">
					Выберите рейс {currentLeg.departure.city.name} &mdash; {currentLeg.arrival.city.name}
				</Typography>
			</div>

			<div className="filters__right">
				<span className="filters-title">Фильтры</span>

				<DirectOnlyFilter/>
				<AirlineFilter/>
				<AirportsFilter/>
				<TimeFilter/>
				<FlightNumber/>
			</div>
		</section>;
	}
}

export default Filters;
