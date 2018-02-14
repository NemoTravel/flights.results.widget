import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';
import Arrow from 'material-ui-icons/KeyboardArrowDown';

import FlightModel from '../schemas/Flight';
import Segment from '../schemas/Segment';
import Price from './Price';

interface Props {
	flight: FlightModel;
}

interface State {
	isOpen: boolean;
}

class Flight extends React.Component<Props, State> {
	state: State = {
		isOpen: false
	};

	constructor(props: Props) {
		super(props);

		this.toggleDetails = this.toggleDetails.bind(this);
	}

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		return this.props.flight.id !== nextProps.flight.id || this.state.isOpen !== nextState.isOpen;
	}

	toggleDetails(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);
	}

	renderSummary(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = flight.segments[flight.segments.length - 1];
		const totalFlightTime = flight.segments.reduce((result: number, segment: Segment) => result + segment.flightTime + segment.waitingTime, 0);
		const isDirect = flight.segments.length === 1;
		const isOW = flight.segmentGroups.length === 1;

		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');

		return <div className={classnames('flight-summary', { 'flight-summary_open': this.state.isOpen })} onClick={this.toggleDetails}>
			<div className="flight-summary__left">
				<div className={classnames('flight-summary-expand', { 'flight-summary-expand_open': this.state.isOpen })}>
					<Arrow/>
				</div>

				<div className="flight-summary-logo">
					<img className="flight-summary-logo__image" src={`http://nemo1${firstSegment.airline.logoIcon}`}/>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{firstSegment.depDate.format('HH:MM')}
					</div>

					<div className="flight-summary-stage__location">
						{firstSegment.depAirport.IATA}
					</div>
				</div>

				<div className="flight-summary-stage-routeInfo">
					<div className="flight-summary-stage-routeInfo__arrow"/>
					<span className="flight-summary-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{lastSegment.arrDate.format('HH:MM')}
					</div>

					<div className="flight-summary-stage__location">
						{lastSegment.arrAirport.IATA}
					</div>
				</div>
			</div>

			<div className="flight-summary__middle">
				<div className="flight-summary-transfers">
					{isDirect ? 'прямой' : null}
					{!isDirect ? flight.segments.slice(0, flight.segments.length - 1).map((segment, index) => {
						const waitingTime = moment.duration(segment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');

						return <div className="flight-summary-transfers__item" key={index}>{waitingTime} пересадка в
							городе {segment.arrAirport.city.name}</div>;
					}) : null}
				</div>

				<div className="flight-summary-route">
					{firstSegment.depAirport.name} &mdash; {lastSegment.arrAirport.name}
				</div>
			</div>

			<div className="flight-summary__right">
				<div className="flight-summary-price">
					<div className="flight-summary-price__amount">
						{!isOW ? 'от' : null}

						<Price price={flight.totalPrice}/>
					</div>

					{!isOW ? <div className="flight-summary-price__route">
						туда и обратно
					</div> : null}
				</div>

				<div className="flight-summary-buy">
					Выбрать
				</div>
			</div>
		</div>;
	}

	renderDetails(): React.ReactNode {
		return <div className={classnames('flight-details', { 'flight-details_open': this.state.isOpen })}>
			123
		</div>;
	}

	render(): React.ReactNode {
		return <div className={classnames('flight', { flight_open: this.state.isOpen })}>
			{this.renderSummary()}
			{this.renderDetails()}
		</div>;
	}
}

export default Flight;
