import * as React from 'react';
import * as classnames from 'classnames';
import FlightTakeOffIcon from '@material-ui/icons/FlightTakeoff';

import FlightModel from '../models/Flight';
import Flight from './Flight';
import Leg from '../schemas/Leg';
import { getLegs, isRT } from '../store/legs/selectors';
import { connect } from '../utils';
import { getCurrentLeg } from '../store/currentLeg/selectors';
import { getSelectedFlights } from '../store/selectedFlights/selectors';

interface StateProps {
	currentLeg: Leg;
	legs: Leg[];
	isRT: boolean;
	selectedFlights: FlightModel[];
}

class SelectedFlights extends React.Component<StateProps> {
	render(): React.ReactNode {
		const { selectedFlights, currentLeg, legs, isRT } = this.props;

		return (
			<div className="results-selectedFlights">
				{legs.map(leg => (
					<div key={leg.id} className={classnames('results-selectedFlights-leg', { 'results-selectedFlights-leg_active': currentLeg.id === leg.id })}>
						<div className={classnames('results-selectedFlights-leg__icon', { 'results-selectedFlights-leg__icon_reverse': isRT && leg.id === 1 })}>
							<FlightTakeOffIcon/>
						</div>

						{leg.departure.city.name} &mdash; {leg.arrival.city.name}
					</div>

				))}
			</div>
		);
	}
}

export default connect<StateProps>({
	isRT: isRT,
	currentLeg: getCurrentLeg,
	selectedFlights: getSelectedFlights,
	legs: getLegs
})(SelectedFlights);
