import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import FlightModel from '../models/Flight';
import Flight from './Flight';
import { ApplicationState, CommonThunkAction } from '../state';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { selectFlight } from '../store/selectedFlights/actions';
import { isFirstLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getPricesForCurrentLeg, getVisibleFlights, PricesByFlights } from '../store/selectors';

export interface OwnProps {
	legId: number;
}

interface StateProps {
	prices: PricesByFlights;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isFirstLeg: boolean;
}

interface DispatchProps {
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
}

type Props = OwnProps & StateProps & DispatchProps;

class FlightsList extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.selectFlight = this.selectFlight.bind(this);
	}

	selectFlight(flightId: number, legId: number): void {
		this.props.selectFlight(flightId, legId);

		if (!this.props.isFirstLeg) {
			// this.props.showSnackbar('Выберите рейс на следующее направление');
		}
	}

	render(): React.ReactNode {
		const { legId, prices } = this.props;

		return this.props.flights.length ?
			this.props.flights.map(flight => (
				<Flight
					key={flight.id}
					price={prices[flight.id]}
					flight={flight}
					selectFlight={this.selectFlight}
					currentLegId={legId}
					showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
				/>
			)) :
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
		isFirstLeg: isFirstLeg(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction, any>): DispatchProps => {
	return {
		selectFlight: bindActionCreators(selectFlight, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(FlightsList);
