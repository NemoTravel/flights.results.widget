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
import { i18n } from '../i18n';
import { getNemoURL } from '../store/config/selectors';

interface StateProps {
	selectedFlights: FlightModel[];
	prices: FlightsReplacement;
	isRT: boolean;
	nemoURL: string;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
}

type Props = StateProps & DispatchProps;

class SelectedFlights extends React.Component<Props> {

	@autobind
	renderFlight(flight: FlightModel): React.ReactNode {
		const { goToLeg, prices, nemoURL } = this.props;

		return (
			<SelectedFlight
				key={flight.legId}
				nemoURL={nemoURL}
				flight={flight}
				goToLeg={goToLeg}
				currentLegId={flight.legId}
				replacement={prices[flight.id]}
				showPricePrefix={flight.legId === 0}
			/>
		);
	}

	render(): React.ReactNode {
		return !!this.props.selectedFlights.length && (
			<div className="results-selectedFlights">
				<div className="results-selectedFlights-title">
					<Typography variant="headline">{isRT ? i18n('results-selected-title_there') : i18n('results-selected-title')}</Typography>
				</div>

				<div className="results-selectedFlights__wrapper">
					{this.props.selectedFlights.map(this.renderFlight)}
				</div>
			</div>
		);
	}
}

export default connect<StateProps, DispatchProps>({
	isRT: isRT,
	nemoURL: getNemoURL,
	selectedFlights: getSelectedFlights,
	prices: getPricesForSelectedFlights
}, { goToLeg })(SelectedFlights);
