import * as React from 'react';
import * as classnames from 'classnames';
import autobind from 'autobind-decorator';
import FlightTakeOffIcon from '@material-ui/icons/FlightTakeoff';

import FlightModel from '../models/Flight';
import Leg from '../schemas/Leg';
import { getLegs, isRT } from '../store/legs/selectors';
import { connect } from '../utils';
import { getCurrentLeg } from '../store/currentLeg/selectors';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import SelectedFlight from './FareFamilies/SelectedFlight';
import { goToLeg } from '../store/currentLeg/actions';
import { FlightsReplacement } from '../schemas/SelectedFlight';
import { getPricesForSelectedFlights } from '../store/selectors';

interface StateProps {
	currentLeg: Leg;
	legs: Leg[];
	isRT: boolean;
	selectedFlights: FlightModel[];
	prices: FlightsReplacement;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
}

type Props = StateProps & DispatchProps;

class SelectedFlights extends React.Component<Props> {
	renderFlightBlock(flight: FlightModel): React.ReactNode {
		const { goToLeg, prices } = this.props;

		return (
			<SelectedFlight
				key={flight.legId}
				flight={flight}
				goToLeg={goToLeg}
				currentLegId={flight.legId}
				replacement={prices[flight.id]}
				showPricePrefix={flight.legId === 0}
			/>
		);
	}

	renderPlaceholder(leg: Leg): React.ReactNode {
		const { currentLeg, isRT } = this.props;

		return (
			<div key={leg.id} className={classnames('results-selectedFlights-leg', { 'results-selectedFlights-leg_active': currentLeg.id === leg.id })}>
				<div className={classnames('results-selectedFlights-leg__icon', { 'results-selectedFlights-leg__icon_reverse': isRT && leg.id === 1 })}>
					<FlightTakeOffIcon/>
				</div>

				{leg.departure.city.name} &mdash; {leg.arrival.city.name}
			</div>
		);
	}

	@autobind
	renderLegContent(leg: Leg): React.ReactNode {
		const { selectedFlights } = this.props;

		if (selectedFlights.hasOwnProperty(leg.id)) {
			return this.renderFlightBlock(selectedFlights[leg.id]);
		}
		else {
			return this.renderPlaceholder(leg);
		}
	}

	render(): React.ReactNode {
		const { legs } = this.props;

		return (
			<div className="results-selectedFlights">
				{legs.map(this.renderLegContent)}
			</div>
		);
	}
}

export default connect<StateProps, DispatchProps>({
	isRT: isRT,
	currentLeg: getCurrentLeg,
	selectedFlights: getSelectedFlights,
	legs: getLegs,
	prices: getPricesForSelectedFlights
}, { goToLeg })(SelectedFlights);
