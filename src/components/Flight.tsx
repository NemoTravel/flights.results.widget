import * as React from 'react';
import { Fragment } from 'react';
import * as moment from 'moment';
import * as classnames from 'classnames';

import Segment from './Flight/Segment';
import Price from './Price';
import FlightModel from '../schemas/Flight';
import SegmentModel from '../schemas/Segment';
import Airline from '../schemas/Airline';
import { ObjectsMap } from '../store/filters/selectors';
import { LocationType } from '../state';
import { declension, REQUEST_URL } from '../utils';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';
import Airport from '../schemas/Airport';
import Money from '../schemas/Money';

export interface Props {
	flight: FlightModel;
	style?: React.CSSProperties;
	onLoad?: () => void;
	currentLegId?: number;
	showPricePrefix?: boolean;
	price?: Money;
	selectFlight?: (flightId: number, legId: number) => void;
	addAirport?: (airport: Airport, type: LocationType) => void;
	addAirline?: (airline: Airline) => void;
}

interface State {
	isOpen: boolean;
}

const MAX_NUM_OF_LOGO_INLINE = 2;

export const createURLForLogo = (baseURL: string, imageURL: string): string => {
	let result: string;

	// If base URL ends with '/' - leave it as is.
	result = baseURL[baseURL.length - 1] === '/' ? baseURL : baseURL + '/';
	// If images URL starts with '/' - remove it (prevent double-slash bug).
	result += imageURL && imageURL[0] === '/' ? imageURL.substr(1) : imageURL;

	return result;
};

class Flight<P> extends React.Component<Props & P, State> {
	static defaultProps: Partial<Props> = {
		onLoad: () => {}
	};

	state: State = {
		isOpen: false
	};

	constructor(props: Props & P) {
		super(props);

		this.toggleDetails = this.toggleDetails.bind(this);
		this.onBuyButtonClick = this.onBuyButtonClick.bind(this);
		this.onDepartureAirportClick = this.onDepartureAirportClick.bind(this);
		this.onArrivalAirportClick = this.onArrivalAirportClick.bind(this);
	}

	shouldComponentUpdate(nextProps: Props & P, nextState: State): boolean {
		return this.props.flight.id !== nextProps.flight.id ||
			this.props.price !== nextProps.price ||
			this.state.isOpen !== nextState.isOpen;
	}

	toggleDetails(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);
	}

	onBuyButtonClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();
		this.props.selectFlight(this.props.flight.id, this.props.currentLegId);
	}

	onDepartureAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		this.props.addAirport(firstSegment.depAirport, LocationType.Departure);
		this.setState({ isOpen: false } as State);
	}

	onArrivalAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();
		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];
		this.props.addAirport(lastSegment.arrAirport, LocationType.Arrival);
		this.setState({ isOpen: false } as State);
	}

	onAirlineClick(airline: Airline): void {
		this.props.addAirline(airline);
		this.setState({ isOpen: false } as State);
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

		return airlinesInFlight.length > MAX_NUM_OF_LOGO_INLINE ?
			<div className="flight-summary-logo__text">{airlinesInFlight.map(airline => airline.name).join(', ')}</div> :
			airlinesInFlight.map((airline, index) => {
				return airline.logoIcon ?
					<img key={index} className="flight-summary-logo__image" title={airline.name} src={createURLForLogo(REQUEST_URL, airline.logoIcon)}/> :
					<div key={index} className="flight-summary-logo__text">{airline.name}</div>;
			});
	}

	renderSummaryButtonsBlock(): React.ReactNode {
		const { flight, price } = this.props;

		return <div className="flight-summary__right">
			<div className="flight-summary-price">
				<div className="flight-summary-price__amount">
					{this.props.showPricePrefix ? <span className="flight-summary-price__amount-prefix">от</span> : null}

					<Price withPlus={this.props.currentLegId !== 0} price={price ? price : flight.totalPrice}/>
				</div>

				<div className="flight-summary-price__route">
					за весь маршрут
				</div>
			</div>

			<div className="flight-summary-buy" onClick={this.onBuyButtonClick}>
				Выбрать
			</div>
		</div>;
	}

	renderSummaryPlaceholder(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = flight.segments[flight.segments.length - 1];
		const allAirlines: Airline[] = [];
		const allAirlinesMap: { [IATA: string]: boolean } = {};

		flight.segments.forEach(segment => {
			if (!allAirlinesMap.hasOwnProperty(segment.airline.IATA)) {
				allAirlines.push(segment.airline);
				allAirlinesMap[segment.airline.IATA] = true;
			}
		});

		return <div className="flight-details-filters">
			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`Вылет: ${firstSegment.depAirport.name}`} onClick={this.onDepartureAirportClick}/>
			</Tooltip>

			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`Прилет: ${lastSegment.arrAirport.name}`} onClick={this.onArrivalAirportClick}/>
			</Tooltip>

			{allAirlines.map((airline, index) => (
				<Tooltip key={index} className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
					<Chip label={airline.name} onClick={event => {
						event.stopPropagation();
						event.preventDefault();
						this.onAirlineClick(airline);
					}}/>
				</Tooltip>
			))}
		</div>;
	}

	renderSummary(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const lastSegment = this.state.isOpen ? firstSegment : flight.segments[flight.segments.length - 1];
		const totalFlightTime = flight.segments.reduce((result: number, segment: SegmentModel) => result + segment.flightTime + segment.waitingTime, 0);
		const arrivalAtNextDay = firstSegment.depDate.date() !== lastSegment.arrDate.date();

		const totalFlightTimeHuman = moment.duration(totalFlightTime, 'seconds').format('d [д] h [ч] m [мин]');

		return <div className={classnames('flight-summary', { 'flight-summary_open': this.state.isOpen })} onClick={this.toggleDetails}>
			<div className="flight-summary__left">
				<div className={classnames('flight-summary-expand', { 'flight-summary-expand_open': this.state.isOpen })}>
					<svg fill="rgba(0, 0, 0, 0.54)" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
						<path d="M0-.75h24v24H0z" fill="none"/>
					</svg>
				</div>

				<div className="flight-summary-logo">
					{this.renderLogo()}
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
					<span className="flight-summary-stage-routeInfo__flightTime">{totalFlightTimeHuman}</span>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						{lastSegment.arrDate.format('HH:mm')}
					</div>

					<div className={classnames('flight-summary-stage__date', { 'flight-summary-stage__date_warning': arrivalAtNextDay })}>
						{lastSegment.arrDate.format('DD MMM')}
					</div>
				</div>
			</div>

			<div className="flight-summary__middle">
				{this.state.isOpen ? this.renderSummaryOpen(firstSegment) : this.renderSummaryClosed()}
			</div>

			{this.renderSummaryButtonsBlock()}
		</div>;
	}

	renderSummaryClosed(): React.ReactNode {
		const flight = this.props.flight;
		const isDirect = flight.segments.length === 1;
		const firstSegment = flight.segments[0];
		const lastSegment = this.state.isOpen ? firstSegment : flight.segments[flight.segments.length - 1];

		return <>
			<div className="flight-summary-transfers">
				{isDirect ? 'прямой' : flight.segments.slice(0, flight.segments.length - 1).map((segment, index) => {
					const waitingTime = moment.duration(segment.waitingTime, 'seconds').format('d [д] h [ч] m [мин]');

					return <div className="flight-summary-transfers__item" key={index}>{waitingTime} пересадка в {declension(segment.arrAirport.city.name)}</div>;
				})}
			</div>

			<div className="flight-summary-route">
				{firstSegment.depAirport.name} &mdash; {lastSegment.arrAirport.name}
			</div>
		</>;
	}

	renderSummaryOpen(segment: SegmentModel): React.ReactNode {
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
		return <div className="flight-details__wrapper">
			<div className="flight-details">
				{this.props.flight.segments.slice(1).map((segment, index) => <Segment key={index} segment={segment}/>)}
			</div>

			{this.renderSummaryPlaceholder()}
		</div>;
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

					{this.state.isOpen ? this.renderDetails() : null}
				</div>
			</div>
		</div>;
	}
}

export default Flight;
