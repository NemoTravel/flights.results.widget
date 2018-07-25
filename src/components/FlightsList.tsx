import * as React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import autobind from 'autobind-decorator';

import FlightModel from '../models/Flight';
import { RootState } from '../store/reducers';
import { SelectedFlightAction, selectFlight } from '../store/selectedFlights/actions';
import { isFirstLeg, isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import {
	FlightsVisibility,
	getRelativePrices, getSortedFlights,
	getTotalPrices,
	getVisibleFlightsMap,
	PricesByFlights
} from '../store/selectors';
import { hasHiddenFlights } from '../store/selectors';
import { showAllFlights } from '../store/showAllFlights/actions';
import { SnackbarProps, withSnackbar } from './Snackbar';
import { FlightsReplacement, default as SelectedFlight } from '../schemas/SelectedFlight';
import { isRT } from '../store/legs/selectors';
import ResultsFlight from './ResultsFlight';
import { i18n } from '../i18n';
import { getNemoURL } from '../store/config/selectors';

export interface OwnProps {
	legId: number;
}

interface StateProps {
	prices: FlightsReplacement;
	totalPrices: PricesByFlights;
	flights: FlightModel[];
	visibilityMap: FlightsVisibility;
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
		const { legId, prices, hasHiddenFlights, totalPrices, nemoURL, visibilityMap } = this.props;
		let visibleHasBeenFound = false;

		return this.props.flights.length ?
			<>
				{this.props.flights.map(flight => {
					let isFirstVisible = false;

					if (!visibleHasBeenFound && visibilityMap[flight.id]) {
						visibleHasBeenFound = true;
						isFirstVisible = true;
					}

					return <ResultsFlight
						key={flight.id}
						nemoURL={nemoURL}
						isHidden={!visibilityMap[flight.id]}
						isFirstVisible={isFirstVisible}
						replacement={prices[flight.id]}
						totalPrice={totalPrices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
					/>;
				})}

				{hasHiddenFlights && (
					<div className="results-flights-showAll">
						<button className="results-flights-showAll__button" onClick={this.showAll}>{i18n('results-showAllTitle')}</button>
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
		flights: getSortedFlights(state),
		visibilityMap: getVisibleFlightsMap(state),
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
