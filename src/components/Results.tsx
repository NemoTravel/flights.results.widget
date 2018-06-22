import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';
import { getLegs, isRT } from '../store/legs/selectors';
import { flightSearchIsActive } from '../store/filters/flightSearch/selectors';
import SelectedFlights from './SelectedFlights';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import { getIsLoading } from '../store/isLoading/selectors';
import FlightModel from '../models/Flight';
import { connect } from '../utils';

interface StateProps {
	isRT: boolean;
	isLoading: boolean;
	hasAnyFlights: boolean;
	hasAnyVisibleFlights: boolean;
	currentLeg: Leg;
	legs: Leg[];
	flightSearchActive: boolean;
	selectedFlights: FlightModel[];
}

class Results extends React.Component<StateProps> {
	renderNoFlights(): React.ReactNode {
		return this.props.isLoading ? null : (
			<div className="results-noResultsTitle">
				<Typography variant="headline">Поиск не дал результатов :(</Typography>
				<Typography variant="subheading">Попробуйте запустить поиск заново или измените текущие параметры формы поиска.</Typography>
			</div>
		);
	}

	render(): React.ReactNode {
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights, isLoading, isRT, flightSearchActive, selectedFlights, legs } = this.props;
		const isMultipleLegs = legs.length > 1;

		if (isLoading) {
			return <div className="results-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
				<Typography variant="subheading">Ищем лучшие перелеты...</Typography>
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
	selectedFlights: getSelectedFlights,
	legs: getLegs,
	flightSearchActive: flightSearchIsActive
})(Results);
