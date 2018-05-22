import * as React from 'react';
import Typography from '@material-ui/core/Typography';

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
		return this.props.currentLeg !== nextProps.currentLeg || this.props.isRT !== nextProps.isRT;
	}

	render(): React.ReactNode {
		const { currentLeg, isRT } = this.props;

		return <section className="filters">
			<div className="filters__left">
				<Typography variant="headline">
					{isRT ? (
						<span>Выберите рейс {currentLeg.id === 0 ? 'туда' : 'обратно'}</span>
					) : (
						<span>Выберите рейс {currentLeg.departure.city.name} &mdash; {currentLeg.arrival.city.name}</span>
					)}
				</Typography>
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
