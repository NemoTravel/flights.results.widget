import * as React from 'react';
import { connect } from 'react-redux';
import { Moment } from 'moment';

import { getAllTimeIntervals, getTimeIntervalForDate, getTimeIntervalName } from '../../store/filters/time/selectors';
import Airline from '../../schemas/Airline';
import Airport from '../../schemas/Airport';
import SegmentModel from '../../schemas/Segment';
import Flight from '../../models/Flight';
import { addTimeInterval, removeTimeInterval } from '../../store/filters/time/actions';
import { addAirport, removeAirport } from '../../store/filters/airports/actions';
import { addAirline, removeAirline } from '../../store/filters/airlines/actions';
import { SnackbarProps, withSnackbar } from '../Snackbar';
import { FlightTimeInterval, LocationType } from '../../enums';
import { RootState } from '../../store/reducers';
import { FiltersState } from '../../store/filters/reducers';
import { QuickFilter } from './QuickFilter';
import { OnClickHandler } from '../../schemas/OnClickHandler';
import { getAllAirlines } from '../../store/filters/airlines/selectors';
import { getArrivalAirports, getDepartureAirports } from '../../store/filters/airports/selectors';
import { TimeFilterState } from '../../store/filters/time/reducers';
import { i18n } from '../../i18n';

interface OwnProps {
	flight: Flight;
}

interface StateProps {
	filters: FiltersState;
	allAirlines: Airline[];
	allDepartureAirports: Airport[];
	allArrivalAirports: Airport[];
	allTimeIntervals: TimeFilterState;
}

interface DispatchProps {
	addAirline: typeof addAirline;
	addAirport: typeof addAirport;
	addTimeInterval: typeof addTimeInterval;
	removeAirline: typeof removeAirline;
	removeAirport: typeof removeAirport;
	removeTimeInterval: typeof removeTimeInterval;
}

type Props = OwnProps & DispatchProps & SnackbarProps & StateProps;

class Filters extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onDepartureAirportClick = this.onDepartureAirportClick.bind(this);
		this.onArrivalAirportClick = this.onArrivalAirportClick.bind(this);
		this.onDepartureTimeIntervalClick = this.onDepartureTimeIntervalClick.bind(this);
		this.onArrivalTimeIntervalClick = this.onArrivalTimeIntervalClick.bind(this);
		this.isFilterActive = this.isFilterActive.bind(this);
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
		this.props.showSnackbar(i18n('filters-airports-snackbar').replace('%airport%', firstSegment.depAirport.name));

		this.scrollToElement();
	}

	onArrivalAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];

		this.props.addAirport(lastSegment.arrAirport.IATA, LocationType.Arrival);
		this.props.showSnackbar(i18n('filters-airports-snackbar').replace('%airport%', lastSegment.arrAirport.name));

		this.scrollToElement();
	}

	onDepartureTimeIntervalClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const firstSegment = flight.segments[0];
		const interval = getTimeIntervalForDate(firstSegment.depDate);
		const intervalName = getTimeIntervalName(interval);

		this.props.addTimeInterval(interval, LocationType.Departure);
		this.props.showSnackbar(i18n('filters-time-departure-snackbar').replace('%interval%', intervalName));

		this.scrollToElement();
	}

	onArrivalTimeIntervalClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];
		const interval = getTimeIntervalForDate(lastSegment.arrDate);
		const intervalName = getTimeIntervalName(interval);

		this.props.addTimeInterval(interval, LocationType.Arrival);
		this.props.showSnackbar(i18n('filters-time-arrival-snackbar').replace('%interval%', intervalName));

		this.scrollToElement();
	}

	onAirlineClick(airline: Airline): void {
		this.props.addAirline(airline.IATA);
		this.props.showSnackbar(i18n('filters-airlines-snackbar').replace('%airline%', airline.name));

		this.scrollToElement();
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.flight.id !== nextProps.flight.id || this.props.filters !== nextProps.filters;
	}

	isFilterActive(name: string, value: string | FlightTimeInterval, direction?: LocationType): boolean {
		if (name === 'time' && this.props.filters.time[direction].length) {
			if (this.props.filters.time[direction].indexOf(value as FlightTimeInterval) >= 0) {
				return true;
			}
		}
		else if (name === 'airlines' && this.props.filters.airlines.length) {
			if (this.props.filters.airlines.indexOf(value as string) >= 0) {
				return true;
			}
		}
		else if (name === 'airports' && this.props.filters.airports[direction].length) {
			if (this.props.filters.airports[direction].indexOf(value as string) >= 0) {
				return true;
			}
		}

		return false;
	}

	renderFilter(label: string, isActive: boolean, onClick: OnClickHandler, onDelete: OnClickHandler, index?: number): React.ReactNode {
		return <QuickFilter
			key={index}
			label={label}
			onClick={onClick}
			isActive={isActive}
			onDelete={onDelete}
			isEnabled={onClick !== null}
		/>;
	}

	renderAirportFilter(airport: Airport, locationType: LocationType): React.ReactNode {
		const isActive = this.isFilterActive('airports', airport.IATA, locationType);
		const allSugestedAirports = locationType === LocationType.Departure ? this.props.allDepartureAirports : this.props.allArrivalAirports;

		const remove = () => {
			this.props.removeAirport(airport.IATA, locationType);
			this.props.showSnackbar(i18n('filters-airports-snackbar-remove').replace('%airport%', airport.name));
		};

		const onClick = locationType === LocationType.Departure ? this.onDepartureAirportClick : this.onArrivalAirportClick;

		return this.renderFilter(airport.name, isActive, allSugestedAirports.length > 1 ? onClick : null, remove);
	}

	renderTimeFilter(time: Moment, locationType: LocationType): React.ReactNode {
		const isActive = this.isFilterActive('time', getTimeIntervalForDate(time), locationType),
				 label = getTimeIntervalName(getTimeIntervalForDate(time)),
				 times = this.props.allTimeIntervals[locationType];

		const remove = () => {
			this.props.removeTimeInterval(getTimeIntervalForDate(time), locationType);

			if (locationType === LocationType.Departure) {
				this.props.showSnackbar(i18n('filters-time-departure-snackbar-remove').replace('%interval%', label));
			}
			else {
				this.props.showSnackbar(i18n('filters-time-arrival-snackbar-remove').replace('%interval%', label));
			}
		};

		const onClick = locationType === LocationType.Departure ? this.onDepartureTimeIntervalClick : this.onArrivalTimeIntervalClick;

		return this.renderFilter(label, isActive, times.length > 1 ? onClick : null, remove);
	}

	renderAirlineFilter(airline: Airline, index: number): React.ReactNode {
		const isActive = this.isFilterActive('airlines', airline.IATA),
			allSugestedAirlines = this.props.allAirlines;

		const onClick: React.EventHandler<any> = event => {
			event.stopPropagation();
			event.preventDefault();

			this.onAirlineClick(airline);
		};

		const remove = () => {
			this.props.removeAirline(airline.IATA);
			this.props.showSnackbar(i18n('filters-airlines-snackbar-remove').replace('%airline%', airline.name));
		};

		return this.renderFilter(airline.name, isActive, allSugestedAirlines.length > 1 ? onClick : null, remove, index);
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
			<span className="flight-details-filters-label">{i18n('filters-quick-departureTitle')}:</span>

			{this.renderAirportFilter(firstSegment.depAirport, LocationType.Departure)}
			{this.renderTimeFilter(firstSegment.depDate, LocationType.Departure)}

			<span className="flight-details-filters-label">{i18n('filters-quick-arrivalTitle')}:</span>

			{this.renderAirportFilter(lastSegment.arrAirport, LocationType.Arrival)}
			{this.renderTimeFilter(lastSegment.arrDate, LocationType.Arrival)}

			<span className="flight-details-filters-label">{i18n('filters-quick-airlinesTitle')}:</span>

			{allAirlines.map((airline, index) => (
				this.renderAirlineFilter(airline, index)
			))}
		</div>;
	}
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		filters: state.filters,
		allAirlines: getAllAirlines(state),
		allDepartureAirports: getDepartureAirports(state),
		allArrivalAirports: getArrivalAirports(state),
		allTimeIntervals: getAllTimeIntervals(state)
	};
};

const mapDispatchToProps = {
	addAirline,
	addAirport,
	addTimeInterval,
	removeAirline,
	removeAirport,
	removeTimeInterval
};

export default withSnackbar<OwnProps>(connect(mapStateToProps, mapDispatchToProps)(Filters));
