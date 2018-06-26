import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flightsByLegs/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';
import { getLegs, isRT } from '../store/legs/selectors';
import { flightSearchIsActive } from '../store/filters/flightSearch/selectors';
import SelectedFlights from './SelectedFlights';
import { getIsLoading } from '../store/isLoading/selectors';
import { connect } from '../utils';
import { i18n } from '../i18n';

interface StateProps {
	isRT: boolean;
	isLoading: boolean;
	hasAnyFlights: boolean;
	hasAnyVisibleFlights: boolean;
	currentLeg: Leg;
	legs: Leg[];
	flightSearchActive: boolean;
}

class Results extends React.Component<StateProps> {
	renderNoFlights(): React.ReactNode {
		return this.props.isLoading ? null : (
			<div className="results-noResultsTitle">
				<Typography variant="headline">{i18n('results-noResultsTitle')}</Typography>
				<Typography variant="subheading">{i18n('results-noResultsSubTitle')}</Typography>
			</div>
		);
	}

	render(): React.ReactNode {
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights, isLoading, isRT, flightSearchActive, legs } = this.props;
		const isMultipleLegs = legs.length > 1;

		if (isLoading) {
			return <div className="results-loader">
				<LinearProgress className="results-loader__progressBar" color="secondary" variant="query"/>
				<Typography variant="headline">{i18n('results-searchInProgressTitle')}</Typography>
			</div>;
		}

		return <div className="results__inner">
			{hasAnyFlights ? <>
				{isMultipleLegs ? <SelectedFlights/> : null}

				<Filters currentLeg={currentLeg} isRT={isRT} withSearch={flightSearchActive}/>

				{hasAnyVisibleFlights ? <Sortings/> : ''}

				<div className="results-flights">
					<FlightsList legId={currentLeg.id}/>
				</div>
			</> : this.renderNoFlights()}
		</div>;
	}
}

export default connect<StateProps>({
	isRT: isRT,
	isLoading: getIsLoading,
	hasAnyFlights: hasAnyFlights,
	hasAnyVisibleFlights: hasAnyVisibleFlights,
	currentLeg: getCurrentLeg,
	legs: getLegs,
	flightSearchActive: flightSearchIsActive
})(Results);
