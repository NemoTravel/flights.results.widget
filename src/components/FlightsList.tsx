import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import FlightModel from '../models/Flight';
import Flight from './Flight';
import { ApplicationState, CommonThunkAction } from '../state';
import { Action } from 'redux';
import { SelectedFlightAction, selectFlight } from '../store/selectedFlights/actions';
import { isFirstLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getPricesForCurrentLeg, getVisibleFlights, PricesByFlights } from '../store/selectors';
import { showAllIsVisible } from '../store/showAllFlights/selectors';
import Button from 'material-ui/Button/Button';
import { showAllFlights } from '../store/showAllFlights/actions';

export interface OwnProps {
	legId: number;
}

interface StateProps {
	prices: PricesByFlights;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isFirstLeg: boolean;
	showAllIsVisible: boolean;
}

interface DispatchProps {
	selectFlight: (flightId: number, legId: number) => SelectedFlightAction;
	showAllFlights: () => Action;
}

type Props = OwnProps & StateProps & DispatchProps;

class FlightsList extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.selectFlight = this.selectFlight.bind(this);
		this.showAll = this.showAll.bind(this);
	}

	selectFlight(flightId: number, legId: number): void {
		this.props.selectFlight(flightId, legId);

		if (!this.props.isFirstLeg) {
			// this.props.showSnackbar('Выберите рейс на следующее направление');
		}
	}

	showAll(): void {
		this.props.showAllFlights();
	}

	render(): React.ReactNode {
		const { legId, prices, showAllIsVisible } = this.props;

		return this.props.flights.length ?
			<>
				{this.props.flights.map(flight => (
					<Flight
						key={flight.id}
						price={prices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
					/>
				))}

				{showAllIsVisible ? <div className="results__flights-showAllButton"><Button variant="raised" onClick={this.showAll}>Показать всё</Button></div> : null}
			</> :
			(
				<Typography variant="headline">Нет результатов.</Typography>
			);
	}
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		prices: getPricesForCurrentLeg(state),
		flights: getVisibleFlights(state),
		isMultipleLegs: isMultipleLegs(state),
		isFirstLeg: isFirstLeg(state),
		showAllIsVisible: showAllIsVisible(state)
	};
};

const mapDispatchToProps = {
	selectFlight,
	showAllFlights
};

export default connect(mapStateToProps, mapDispatchToProps)(FlightsList);
