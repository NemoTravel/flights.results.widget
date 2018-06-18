import * as React from 'react';
import autobind from 'autobind-decorator';

import FlightModel from '../models/Flight';
import { connect } from '../utils';
import { getSelectedFlights } from '../store/selectedFlights/selectors';
import SelectedFlight from './SelectedFlight';
import { goToLeg } from '../store/currentLeg/actions';
import { FlightsReplacement } from '../schemas/SelectedFlight';
import { getPricesForSelectedFlights } from '../store/selectors';
import Typography from '@material-ui/core/Typography';
import { isRT } from '../store/legs/selectors';

interface StateProps {
	selectedFlights: FlightModel[];
	prices: FlightsReplacement;
	isRT: boolean;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
}

type Props = StateProps & DispatchProps;

class SelectedFlights extends React.Component<Props> {
	@autobind
	renderFlight(flight: FlightModel): React.ReactNode {
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

	render(): React.ReactNode {
		return (
			<div className="results-selectedFlights">
				{this.props.selectedFlights.length ? (
					<div className="results-selectedFlights-title">
						<Typography variant="headline">{isRT ? 'Рейс туда' : 'Выбранные рейсы'}</Typography>
					</div>
				) : null}

				<div className="results-selectedFlights__wrapper">
					{this.props.selectedFlights.map(this.renderFlight)}
				</div>
			</div>
		);
	}
}

export default connect<StateProps, DispatchProps>({
	isRT: isRT,
	selectedFlights: getSelectedFlights,
	prices: getPricesForSelectedFlights
}, { goToLeg })(SelectedFlights);
