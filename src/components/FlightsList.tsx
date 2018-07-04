import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import FlightModel from '../models/Flight';
import { RootState } from '../store/reducers';
import { SelectedFlightAction, selectFlight } from '../store/selectedFlights/actions';
import { isFirstLeg, isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getRelativePrices, getTotalPrices, getVisibleFlights, PricesByFlights } from '../store/selectors';
import { hasHiddenFlights } from '../store/selectors';
import Button from '@material-ui/core/Button/Button';
import { showAllFlights } from '../store/showAllFlights/actions';
import { SnackbarProps, withSnackbar } from './Snackbar';
import { FlightsReplacement, default as SelectedFlight } from '../schemas/SelectedFlight';
import { isRT } from '../store/legs/selectors';
import ResultsFlight from './ResultsFlight';
import { i18n } from '../i18n';
import { getNemoURL } from '../store/config/selectors';
import autobind from 'autobind-decorator';

export interface OwnProps {
	legId: number;
}

interface StateProps {
	prices: FlightsReplacement;
	totalPrices: PricesByFlights;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isFirstLeg: boolean;
	isLastLeg: boolean;
	isRT: boolean;
	hasHiddenFlights: boolean;
	nemoURL: string;
}

interface DispatchProps {
	selectFlight: typeof selectFlight;
	showAllFlights: typeof showAllFlights;
}

type Props = OwnProps & StateProps & DispatchProps & SnackbarProps;

class FlightsList extends React.Component<Props> {
	@autobind
	selectFlight(flight: SelectedFlight, legId: number): SelectedFlightAction {
		if (this.props.isRT && legId === 0) {
			this.props.showSnackbar(i18n('results-title_back'));
		}
		else if (!this.props.isLastLeg) {
			this.props.showSnackbar(i18n('results-title_next'));
		}

		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}, 0);

		return this.props.selectFlight(flight, legId);
	}

	@autobind
	showAll(): void {
		this.props.showAllFlights();
	}

	render(): React.ReactNode {
		const { legId, prices, hasHiddenFlights, totalPrices, nemoURL } = this.props;

		return this.props.flights.length ?
			<>
				{this.props.flights.map(flight => (
					<ResultsFlight
						key={flight.id}
						nemoURL={nemoURL}
						replacement={prices[flight.id]}
						totalPrice={totalPrices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
					/>
				))}

				{hasHiddenFlights && (
					<div className="results-flights-showAllButton">
						<Button variant="raised" onClick={this.showAll}>{i18n('results-showAllTitle')}</Button>
					</div>
				)}
			</> :
			(
				<div className="results-noResultsTitle">
					<Typography variant="headline">{i18n('filters-noResultsTitle')}</Typography>
					<Typography variant="subheading">{i18n('filters-noResultsSubTitle')}</Typography>
				</div>
			);
	}
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		nemoURL: getNemoURL(state),
		prices: getRelativePrices(state),
		totalPrices: getTotalPrices(state),
		flights: getVisibleFlights(state),
		isMultipleLegs: isMultipleLegs(state),
		isFirstLeg: isFirstLeg(state),
		isLastLeg: isLastLeg(state),
		isRT: isRT(state),
		hasHiddenFlights: hasHiddenFlights(state)
	};
};

const mapDispatchToProps = {
	selectFlight,
	showAllFlights
};

export default withSnackbar<OwnProps>(connect(mapStateToProps, mapDispatchToProps)(FlightsList));
