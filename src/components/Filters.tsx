import * as React from 'react';
import * as classnames from 'classnames';
import Typography from 'material-ui/Typography';
import FlightTakeOffIcon from 'material-ui-icons/FlightTakeoff';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import Leg from '../schemas/Leg';

interface Props {
	currentLeg: Leg;
	isRT: boolean;
}

class Filters extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.currentLeg !== nextProps.currentLeg;
	}

	render(): React.ReactNode {
		const { currentLeg, isRT } = this.props;

		return <section className="filters">
			<div className="filters__left">
				<Typography variant="headline">
					Выберите рейс {currentLeg.departure.city.name} &mdash; {currentLeg.arrival.city.name}
				</Typography>

				{isRT ? <FlightTakeOffIcon className={classnames('filters-title__plane', { 'filters-title__plane_reverse': currentLeg.id === 1 })}/> : null}
			</div>

			<div className="filters__right">
				<span className="filters-title">Фильтры</span>

				<DirectOnlyFilter/>
				<AirlineFilter/>
				<AirportsFilter/>
				<TimeFilter/>
			</div>
		</section>;
	}
}

export default Filters;
