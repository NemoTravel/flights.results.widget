import * as React from 'react';
import { connect } from 'react-redux';
import { LinearProgress } from 'material-ui/Progress';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import TimeFilter from './Filters/Time';
import Flight from './Flight';
import { ApplicationState } from '../main';
import FlightModel from '../schemas/Flight';
import Airline from '../schemas/Airline';
import {
	getAirlinesList, getArrivalAirportsList, getDepartureAirportsList,
	getSelectedAirlinesList, SelectedAirlinesList
} from '../store/selectors';
import Airport from '../schemas/Airport';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { addAirline, removeAirline, FilterAirlinesAction } from '../store/filters/actions';

interface StateProps {
	isLoading: boolean;
	airlines: Airline[];
	flights: FlightModel[];
	departureAirports: Airport[];
	arrivalAirports: Airport[];
	selectedAirlines: SelectedAirlinesList;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	removeAirline: (IATA: string) => FilterAirlinesAction;
}

class Main extends React.Component<StateProps & DispatchProps> {
	render(): React.ReactNode {
		return this.props.isLoading ?
			<LinearProgress color="secondary" variant="query"/> :
			<div className="results-wrapper">
				<section className="scenarios">

				</section>

				<section className="filters">
					<AirlineFilter airlines={this.props.airlines} addAirline={this.props.addAirline} removeAirline={this.props.removeAirline} selectedAirlines={this.props.selectedAirlines}/>
					<AirportsFilter departureAirports={this.props.departureAirports} arrivalAirports={this.props.arrivalAirports}/>
					<TimeFilter/>
				</section>

				<section className="results">
					{this.props.flights.map((flight, index) => <Flight key={index} flight={flight}/>)}
				</section>
			</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		flights: state.flights,
		airlines: getAirlinesList(state),
		selectedAirlines: getSelectedAirlinesList(state),
		departureAirports: getDepartureAirportsList(state),
		arrivalAirports: getArrivalAirportsList(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		removeAirline: bindActionCreators(removeAirline, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
