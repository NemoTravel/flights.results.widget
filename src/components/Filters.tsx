import * as React from 'react';
import * as classnames from 'classnames';
import Typography from '@material-ui/core/Typography';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import ComfortableFilter from './Filters/Comfortabe';
import FlightSearchFilter from './Filters/FlightSearch';
import Leg from '../schemas/Leg';
import { i18n } from '../i18n';
import MediaQuery from 'react-responsive';
import { ScreenMaxSize } from '../enums';

interface Props {
	currentLeg: Leg;
	isRT: boolean;
	withSearch: boolean;
}

class Filters extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return (
			this.props.currentLeg !== nextProps.currentLeg ||
			this.props.isRT !== nextProps.isRT ||
			this.props.withSearch !== nextProps.withSearch
		);
	}

	render(): React.ReactNode {
		const { currentLeg, isRT, withSearch } = this.props;
		const classNames = classnames('filters', {filters_withBottomMargin: withSearch});

		return <section className={classNames}>
			<div className="filters__left">
				<Typography variant="headline">
					{isRT ? (
						<span>{currentLeg.id === 0 ? i18n('results-title_there') : i18n('results-title_back')}</span>
					) : (
						<span>{i18n('results-title')} {currentLeg.departure.city.name} &mdash; {currentLeg.arrival.city.name}</span>
					)}
				</Typography>
			</div>

			<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
				<div className="filters__right">
					<span className="filters-title">{i18n('filters-title')}</span>

					<ComfortableFilter/>
					<DirectOnlyFilter/>
					<AirlineFilter/>
					<AirportsFilter/>
					<TimeFilter/>
					<FlightSearchFilter/>
				</div>
			</MediaQuery>
		</section>;
	}
}

export default Filters;
