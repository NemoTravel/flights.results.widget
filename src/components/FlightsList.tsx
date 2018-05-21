import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import FlightModel from '../models/Flight';
import Flight from './Flight';
import { RootState } from '../store/reducers';
import { SelectedFlightAction, selectFlight } from '../store/selectedFlights/actions';
import { isFirstLeg, isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getRelativePrices, getVisibleFlights } from '../store/selectors';
import { hasHiddenFlights } from '../store/selectors';
import Button from 'material-ui/Button/Button';
import { showAllFlights } from '../store/showAllFlights/actions';
import { SnackbarProps, withSnackbar } from './Snackbar';
import { FlightsReplacement, default as SelectedFlight } from '../schemas/SelectedFlight';
import { isRT } from '../store/legs/selectors';

export interface OwnProps {
	legId: number;
}

interface StateProps {
	prices: FlightsReplacement;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isFirstLeg: boolean;
	isLastLeg: boolean;
	isRT: boolean;
	hasHiddenFlights: boolean;
}

interface DispatchProps {
	selectFlight: typeof selectFlight;
	showAllFlights: typeof showAllFlights;
}

type Props = OwnProps & StateProps & DispatchProps & SnackbarProps;

class FlightsList extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.selectFlight = this.selectFlight.bind(this);
		this.showAll = this.showAll.bind(this);
	}

	selectFlight(flight: SelectedFlight, legId: number): SelectedFlightAction {
		if (this.props.isRT && legId === 0) {
			this.props.showSnackbar('Выберите рейс обратно');
		}
		else if (!this.props.isLastLeg) {
			this.props.showSnackbar('Выберите рейс на следующее направление');
		}

		setTimeout(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		}, 0);

		return this.props.selectFlight(flight, legId);
	}

	showAll(): void {
		this.props.showAllFlights();
	}

	render(): React.ReactNode {
		const { legId, prices, hasHiddenFlights } = this.props;

		return this.props.flights.length ?
			<>
				{this.props.flights.map(flight => (
					<Flight
						key={flight.id}
						replacement={prices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
					/>
				))}

				{hasHiddenFlights ? <div className="results__flights-showAllButton"><Button variant="raised" onClick={this.showAll}>Показать всё</Button></div> : null}
			</> :
			(
				<Typography variant="headline">Нет результатов.</Typography>
			);
	}
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		prices: getRelativePrices(state),
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
