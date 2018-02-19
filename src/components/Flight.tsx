import * as React from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';

import Segment from './Flight/Segment';
import Price from './Price';
import FlightModel from '../schemas/Flight';
import SegmentModel from '../schemas/Segment';
import Airline from '../schemas/Airline';
import { ObjectsMap } from '../store/filters/selectors';

interface Props {
	flight: FlightModel;
	style?: React.CSSProperties;
	onLoad: () => void;
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

	renderLogo(): React.ReactNode {
		const { flight } = this.props;
		const airlinesMap: ObjectsMap<Airline> = {};
		const airlinesInFlight: Airline[] = [];

		flight.segments.forEach(segment => {
			if (!airlinesMap.hasOwnProperty(segment.airline.IATA)) {
				airlinesMap[segment.airline.IATA] = segment.airline;
				airlinesInFlight.push(segment.airline);
			}
		});

		return airlinesInFlight.length > 1 ?
			airlinesInFlight.map(airline => airline.name).join(', ') :
			<img className="flight-summary-logo__image" src={`http://nemo1${flight.segments[0].airline.logoIcon}`}/>;
	}

	renderSummary(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = flight.segments[flight.segments.length - 1];
		const totalFlightTime = flight.segments.reduce((result: number, segment: SegmentModel) => result + segment.flightTime + segment.waitingTime, 0);
		const isDirect = flight.segments.length === 1;
		const isOW = flight.segmentGroups.length === 1;

		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');

		return <div className={classnames('flight-summary', { 'flight-summary_open': this.state.isOpen })} onClick={this.toggleDetails}>
			<div className="flight-summary__left">
				<div className={classnames('flight-summary-expand', { 'flight-summary-expand_open': this.state.isOpen })}>
					<svg fill="rgba(0, 0, 0, 0.54)" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
						<path d="M0-.75h24v24H0z" fill="none"/>
					</svg>
				</div>

				<div className="flight-summary-placeholder">
					<span className="flight-summary-placeholder__date">{firstSegment.depDate.format('D MMMM, dddd')}</span>
					<span className="flight-summary-placeholder__route">{firstSegment.depAirport.city.name} &mdash; {lastSegment.arrAirport.city.name}</span>
				</div>

				<div className="flight-summary-logo">
					{this.renderLogo()}
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
		return this.state.isOpen ? <div className="flight-details__wrapper">
			<div className="flight-details">
				{this.props.flight.segments.map((segment, index) => <Segment key={index} segment={segment}/>)}
			</div>
		</div> : null;
	}

	componentDidMount(): void {
		this.props.onLoad();
	}

	componentDidUpdate(): void {
		this.props.onLoad();
	}

	render(): React.ReactNode {
		return <div className="flight" style={this.props.style}>
			<div className={classnames('flight__wrapper', { flight__wrapper_open: this.state.isOpen })}>
				<div className="flight__shadow">
					{this.renderSummary()}
					{this.renderDetails()}
				</div>
			</div>
		</div>;
	}
}

export default Flight;
