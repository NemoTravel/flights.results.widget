import * as React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';

import { getTimeIntervalForDate, getTimeIntervalName } from '../../store/filters/time/selectors';
import Airline from '../../schemas/Airline';
import SegmentModel from '../../schemas/Segment';
import Flight from '../../schemas/Flight';
import { FlightTimeInterval, LocationType } from '../../state';
import { addTimeInterval, FilterTimeAction } from '../../store/filters/time/actions';
import { addAirport, FilterAirportsAction } from '../../store/filters/airports/actions';
import { addAirline, FilterAirlinesAction } from '../../store/filters/airlines/actions';

interface OwnProps {
	flight: Flight;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	addAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	addTimeInterval: (time: FlightTimeInterval, type: LocationType) => FilterTimeAction;
}

type Props = OwnProps & DispatchProps;

class Filters extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onDepartureAirportClick = this.onDepartureAirportClick.bind(this);
		this.onArrivalAirportClick = this.onArrivalAirportClick.bind(this);
		this.onDepartureTimeIntervalClick = this.onDepartureTimeIntervalClick.bind(this);
		this.onArrivalTimeIntervalClick = this.onArrivalTimeIntervalClick.bind(this);
	}

	scrollToElement(): void {
		setTimeout(() => {
			document.querySelector(`[data-flight-id="${this.props.flight.id}"]`).scrollIntoView({
				behavior: 'smooth'
			});
		}, 0);
	}

	onDepartureAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const firstSegment = flight.segments[0];

		this.props.addAirport(firstSegment.depAirport.IATA, LocationType.Departure);

		this.scrollToElement();
	}

	onArrivalAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];

		this.props.addAirport(lastSegment.arrAirport.IATA, LocationType.Arrival);

		this.scrollToElement();
	}

	onDepartureTimeIntervalClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const firstSegment = flight.segments[0];

		this.props.addTimeInterval(getTimeIntervalForDate(firstSegment.depDate), LocationType.Departure);

		this.scrollToElement();
	}

	onArrivalTimeIntervalClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];

		this.props.addTimeInterval(getTimeIntervalForDate(lastSegment.arrDate), LocationType.Arrival);

		this.scrollToElement();
	}

	onAirlineClick(airline: Airline): void {
		this.props.addAirline(airline.IATA);

		this.scrollToElement();
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.flight.id !== nextProps.flight.id;
	}

	render(): React.ReactNode {
		const flight = this.props.flight;
		const firstSegment: SegmentModel = flight.segments[0];
		const lastSegment: SegmentModel = flight.segments[flight.segments.length - 1];
		const allAirlines: Airline[] = [];
		const allAirlinesMap: { [IATA: string]: boolean } = {};

		flight.segments.forEach(segment => {
			if (!allAirlinesMap.hasOwnProperty(segment.airline.IATA)) {
				allAirlines.push(segment.airline);
				allAirlinesMap[segment.airline.IATA] = true;
			}
		});

		return <div className="flight-details-filters">
			<span className="flight-details-filters-label">Вылет:</span>

			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`${firstSegment.depAirport.name}`} onClick={this.onDepartureAirportClick}/>
			</Tooltip>

			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`${getTimeIntervalName(getTimeIntervalForDate(firstSegment.depDate))}`} onClick={this.onDepartureTimeIntervalClick}/>
			</Tooltip>

			<span className="flight-details-filters-label">Прилёт:</span>

			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`${lastSegment.arrAirport.name}`} onClick={this.onArrivalAirportClick}/>
			</Tooltip>

			<Tooltip className="flight-details-filters-chip" title="Добавить в фильтры" placement="top">
				<Chip label={`${getTimeIntervalName(getTimeIntervalForDate(lastSegment.arrDate))}`} onClick={this.onArrivalTimeIntervalClick}/>
			</Tooltip>

			<span className="flight-details-filters-label">Авиакомпании:</span>

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
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction, any>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		addAirport: bindActionCreators(addAirport, dispatch),
		addTimeInterval: bindActionCreators(addTimeInterval, dispatch)
	};
};

export default connect(null, mapDispatchToProps)(Filters);
