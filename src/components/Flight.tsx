import * as React from 'react';
import * as classnames from 'classnames';

import Segment from './Flight/Segment';
import Filters from './Flight/Filters';
import Price from './Price';
import FlightModel from '../models/Flight';
import SegmentModel from '../schemas/Segment';
import Airline from '../schemas/Airline';
import { ObjectsMap } from '../store/filters/selectors';
import { fixImageURL } from '../utils';
import Button from './Flight/Button';
import { SelectedFlight } from '../store/selectors';

export interface Props {
	flight: FlightModel;
	style?: React.CSSProperties;
	currentLegId?: number;
	showPricePrefix?: boolean;
	replacement?: SelectedFlight;
	selectFlight?: (flightId: number, legId: number) => void;
}

interface State {
	isOpen: boolean;
}

const MAX_NUM_OF_LOGO_INLINE = 2;

const stateByFlights: { [flightId: number]: State } = {};

class Flight<P> extends React.Component<Props & P, State> {
	protected mainClassName = 'flight';

	constructor(props: Props & P) {
		super(props);

		this.state = stateByFlights[this.props.flight.id] ? stateByFlights[this.props.flight.id] : { isOpen: false };

		this.toggleDetails = this.toggleDetails.bind(this);
		this.onBuyButtonClick = this.onBuyButtonClick.bind(this);
	}

	shouldComponentUpdate(nextProps: Props & P, nextState: State): boolean {
		return this.props.flight.id !== nextProps.flight.id ||
			this.props.replacement !== nextProps.replacement ||
			this.state.isOpen !== nextState.isOpen;
	}

	toggleDetails(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);
	}

	componentWillUnmount(): void {
		stateByFlights[this.props.flight.id] = this.state;
	}

	onBuyButtonClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		this.props.selectFlight(this.props.replacement.newFlightId, this.props.currentLegId);
	}

	renderLogo(firstOnly = false): React.ReactNode {
		const { flight } = this.props;
		const airlinesMap: ObjectsMap<Airline> = {};
		const airlinesInFlight: Airline[] = [];
		const segments: SegmentModel[] = firstOnly ? [ flight.segments[0] ] : flight.segments;

		segments.forEach(segment => {
			if (!airlinesMap.hasOwnProperty(segment.airline.IATA)) {
				airlinesMap[segment.airline.IATA] = segment.airline;
				airlinesInFlight.push(segment.airline);
			}
		});

		return airlinesInFlight.length > MAX_NUM_OF_LOGO_INLINE ?
			<div className="flight-summary-logo__text">{airlinesInFlight.map(airline => airline.name).join(', ')}</div> :
			airlinesInFlight.map((airline, index) => {
				return airline.logoIcon ?
					<img key={index} className="flight-summary-logo__image" title={airline.name} src={fixImageURL(airline.logoIcon)}/> :
					<div key={index} className="flight-summary-logo__text">{airline.name}</div>;
			});
	}

	renderSummaryButtonsBlock(): React.ReactNode {
		const { flight, replacement } = this.props;

		return <div className="flight-summary__right">
			<div className="flight-summary-price">
				<div className="flight-summary-price__amount">
					{this.props.showPricePrefix ? <span className="flight-summary-price__amount-prefix">от</span> : null}

					<Price withPlus={this.props.currentLegId !== 0} price={replacement ? replacement.price : flight.totalPrice}/>
				</div>

				<div className="flight-summary-price__route">
					за весь маршрут
				</div>
			</div>

			<Button className="flight-summary-buy" onClick={this.onBuyButtonClick}/>
		</div>;
	}

	renderFilters(): React.ReactNode {
		return <Filters flight={this.props.flight}/>;
	}

	renderSummary(): React.ReactNode {
		const flight: FlightModel = this.props.flight;
		const firstSegment = flight.firstSegment;
		const lastSegment = this.state.isOpen ? firstSegment : flight.lastSegment;

		return <div className={classnames('flight-summary', { 'flight-summary_open': this.state.isOpen })} onClick={this.toggleDetails}>
			<div className="flight-summary__left">
				<div className={classnames('flight-summary-expand', { 'flight-summary-expand_open': this.state.isOpen })}>
					<svg fill="rgba(0, 0, 0, 0.54)" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
						<path d="M0-.75h24v24H0z" fill="none"/>
					</svg>
				</div>

				<div className="flight-summary-logo">
					{this.renderLogo(this.state.isOpen)}
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{firstSegment.depDate.format('HH:mm')}
					</div>

					<div className="flight-summary-stage__date">
						{firstSegment.depDate.format('DD MMM')}
					</div>
				</div>

				<div className="flight-summary-stage-routeInfo">
					<div className="flight-summary-stage-routeInfo__arrow"/>
					<span className="flight-summary-stage-routeInfo__flightTime">{flight.totalFlightTimeHuman}</span>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{lastSegment.arrDate.format('HH:mm')}
					</div>

					<div className={classnames('flight-summary-stage__date', { 'flight-summary-stage__date_warning': flight.arrivalAtNextDay })}>
						{lastSegment.arrDate.format('DD MMM')}
					</div>
				</div>
			</div>

			<div className="flight-summary__middle">
				{this.state.isOpen ? this.renderSummaryMiddleOpened() : this.renderSummaryMiddleClosed()}
			</div>

			{this.renderSummaryButtonsBlock()}
		</div>;
	}

	renderSummaryMiddleClosed(): React.ReactNode {
		const flight: FlightModel = this.props.flight;
		const isDirect = flight.segments.length === 1;
		const firstSegment = flight.firstSegment;
		const lastSegment = this.state.isOpen ? firstSegment : flight.lastSegment;

		return <>
			<div className="flight-summary-transfers">
				{isDirect ? 'прямой' : flight.transferInfo.map((info, index) => (
					<div className="flight-summary-transfers__item" key={index}>{info}</div>
				))}
			</div>

			<div className="flight-summary-route">
				{firstSegment.depAirport.name} &mdash; {lastSegment.arrAirport.name}
			</div>
		</>;
	}

	renderSummaryMiddleOpened(): React.ReactNode {
		const segment = this.props.flight.firstSegment;

		return <>
			<div>Рейс <strong>{segment.airline.IATA}-{segment.flightNumber}</strong>, {segment.aircraft.name}</div>

			<div className="flight-details-segment-route">
				{segment.depAirport.city.name}{segment.depAirport.city.name !== segment.depAirport.name ? ', ' + segment.depAirport.name : null}
				&nbsp;&mdash;&nbsp;
				{segment.arrAirport.city.name}{segment.arrAirport.city.name !== segment.arrAirport.name ? ', ' + segment.arrAirport.name : null}
			</div>
		</>;
	}

	renderDetails(): React.ReactNode {
		return this.state.isOpen ? <div className="flight-details__wrapper">
			<div className="flight-details">
				{this.props.flight.segments.slice(1).map((segment, index) => <Segment key={index} segment={segment}/>)}
			</div>

			{this.renderFilters()}
		</div> : null;
	}

	render(): React.ReactNode {
		return <div className={classnames(this.mainClassName, { flight_open: this.state.isOpen })} data-flight-id={this.props.flight.id}>
			<div className="flight__shadow">
				{this.renderSummary()}
				{this.renderDetails()}
			</div>
		</div>;
	}
}

export default Flight;
