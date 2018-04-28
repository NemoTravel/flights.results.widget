import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import FlightModel from '../schemas/Flight';
import Flight from './Flight';
import { ApplicationState, CommonThunkAction, FlightTimeInterval, LocationType } from '../state';
import { addAirline, FilterAirlinesAction } from '../store/filters/airlines/actions';
import { addAirport, FilterAirportsAction } from '../store/filters/airports/actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { selectFlight } from '../store/selectedFlights/actions';
import Airport from '../schemas/Airport';
import Airline from '../schemas/Airline';
import { isFirstLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getPricesForCurrentLeg, getVisibleFlights, PricesByFlights } from '../store/selectors';
import { addTimeInterval, FilterTimeAction } from '../store/filters/time/actions';
import { getTimeIntervalName } from '../store/filters/time/selectors';

export interface OwnProps {
	legId: number;
	showSnackbar: (label: string) => void;
}

interface StateProps {
	prices: PricesByFlights;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isFirstLeg: boolean;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	addAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
	addTimeInterval: (time: FlightTimeInterval, type: LocationType) => FilterTimeAction;
}

type Props = OwnProps & StateProps & DispatchProps;

class FlightsList extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.selectFlight = this.selectFlight.bind(this);
		this.addAirportToFilters = this.addAirportToFilters.bind(this);
		this.addTimeInterval = this.addTimeInterval.bind(this);
		this.addAirlineToFilters = this.addAirlineToFilters.bind(this);
	}

	selectFlight(flightId: number, legId: number): void {
		this.props.selectFlight(flightId, legId);

		if (!this.props.isFirstLeg) {
			this.props.showSnackbar('Выберите рейс на следующее направление');
		}
	}

	addAirportToFilters(airport: Airport, type: LocationType): void {
		this.props.addAirport(airport.IATA, type);
		this.props.showSnackbar(`Аэропорт «${airport.name}» был добавлен в фильтры`);
	}

	addTimeInterval(timeInterval: FlightTimeInterval, type: LocationType): void {
		const typeName = type === LocationType.Arrival ? 'прилета' : 'вылета';
		const intervalName = getTimeIntervalName(timeInterval);

		this.props.addTimeInterval(timeInterval, type);
		this.props.showSnackbar(`Время ${typeName} «${intervalName}» было добавлено в фильтры`);
	}

	addAirlineToFilters(airline: Airline): void {
		this.props.addAirline(airline.IATA);
		this.props.showSnackbar(`Авиакомпания «${airline.name}» была добавлена в фильтры`);
	}

	render(): React.ReactNode {
		const { legId, prices } = this.props;

		return this.props.flights.length ?
			this.props.flights.map(flight => (
				<div key={flight.id} className="flight__holder">
					<Flight
						price={prices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={this.props.isFirstLeg && this.props.isMultipleLegs}
						addAirport={this.addAirportToFilters}
						addTimeInterval={this.addTimeInterval}
						addAirline={this.addAirlineToFilters}
					/>
				</div>
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
		addAirline: bindActionCreators(addAirline, dispatch),
		addAirport: bindActionCreators(addAirport, dispatch),
		addTimeInterval: bindActionCreators(addTimeInterval, dispatch),
		selectFlight: bindActionCreators(selectFlight, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(FlightsList);
