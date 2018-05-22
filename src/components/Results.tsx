import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import { getCurrentLeg } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { RootState } from '../store/reducers';
import FlightsList from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import { hasAnyVisibleFlights } from '../store/selectors';
import { isRT } from '../store/legs/selectors';
import FlightModel from '../models/Flight';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import Flight from './Flight';

interface StateProps {
	isRT: boolean;
	isLoading: boolean;
	hasAnyFlights: boolean;
	hasAnyVisibleFlights: boolean;
	currentLeg: Leg;
	selectedFlights: FlightModel[];
}

class Results extends React.Component<StateProps> {
	renderNoFlights(): React.ReactNode {
		return this.props.isLoading ? null : <Typography variant="headline">Нет результатов.</Typography>;
	}

	render(): React.ReactNode {
		const { currentLeg, hasAnyFlights, hasAnyVisibleFlights, isLoading, isRT, selectedFlights } = this.props;

		if (isLoading) {
			return <div className="results-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>;
		}

		return hasAnyFlights ? <>
			<div className="results__inner-content">
				{selectedFlights.length ? (
					<div className="results-selectedFlights">
						<div className="results-selectedFlights__title">
							<Typography variant="headline">Выбранные перелеты</Typography>
						</div>

						<div className="results-selectedFlights__list">
							{selectedFlights.map(flight => (
								<Flight key={flight.id} flight={flight}/>
							))}
						</div>
					</div>
				) : null}

				<Filters currentLeg={currentLeg} isRT={isRT}/>

				{hasAnyVisibleFlights ? <Sortings/> : ''}

				<div className="results-flights">
					<FlightsList legId={currentLeg.id}/>
				</div>
			</div>
		</> : this.renderNoFlights();
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isRT: isRT(state),
		isLoading: state.isLoading,
		hasAnyFlights: hasAnyFlights(state),
		hasAnyVisibleFlights: hasAnyVisibleFlights(state),
		currentLeg: getCurrentLeg(state),
		selectedFlights: getSelectedFlights(state)
	};
};

export default connect(mapStateToProps)(Results);
