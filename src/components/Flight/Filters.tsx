import * as React from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';
import { Moment } from 'moment';
import * as classnames from 'classnames';

import { getTimeIntervalForDate, getTimeIntervalName } from '../../store/filters/time/selectors';
import Airline from '../../schemas/Airline';
import Airport from '../../schemas/Airport';
import SegmentModel from '../../schemas/Segment';
import Flight from '../../models/Flight';
import { addTimeInterval } from '../../store/filters/time/actions';
import { addAirport } from '../../store/filters/airports/actions';
import { addAirline } from '../../store/filters/airlines/actions';
import { SnackbarProps, withSnackbar } from '../Snackbar';
import { LocationType } from '../../enums';
import { RootState } from '../../store/reducers';
import { FiltersState } from '../../store/filters/reducers';

interface OwnProps {
	flight: Flight;
}

interface StateProps {
	filters: FiltersState;
}

interface DispatchProps {
	addAirline: typeof addAirline;
	addAirport: typeof addAirport;
	addTimeInterval: typeof addTimeInterval;
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
		this.props.showSnackbar(`Аэропорт «${firstSegment.depAirport.name}» был добавлен в фильтры`);

		this.scrollToElement();
	}

	onArrivalAirportClick(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		const flight = this.props.flight;
		const lastSegment = flight.segments[flight.segments.length - 1];

		this.props.addAirport(lastSegment.arrAirport.IATA, LocationType.Arrival);
		this.props.showSnackbar(`Аэропорт «${lastSegment.arrAirport.name}» был добавлен в фильтры`);

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
		this.props.showSnackbar(`Время вылета «${intervalName}» было добавлено в фильтры`);

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
		this.props.showSnackbar(`Время прилета «${intervalName}» было добавлено в фильтры`);

		this.scrollToElement();
	}

	onAirlineClick(airline: Airline): void {
		this.props.addAirline(airline.IATA);
		this.props.showSnackbar(`Авиакомпания «${airline.name}» была добавлена в фильтры`);

		this.scrollToElement();
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.flight.id !== nextProps.flight.id || this.props.filters !== nextProps.filters;
	}

	isFilterActive(name: string, value: any, direction?: LocationType): boolean {
		if (name === 'time' && this.props.filters.time[direction]) {
			if (this.props.filters.time[direction].indexOf(value) >= 0) {
				return true;
			}
		}
		else if (name === 'airlines' && this.props.filters.airlines) {
			if (this.props.filters.airlines.indexOf(value) >= 0) {
				return true;
			}
		}
		else if (name === 'airports' && this.props.filters.airports[direction]) {
			if (this.props.filters.airports[direction].indexOf(value) >= 0) {
				return true;
			}
		}

		return false;
	}

	renderFilter(label: string, isActive: boolean, onClick: React.EventHandler<any>, onDelete: React.EventHandler<any>, index?: number): React.ReactNode {
		return <Tooltip title="Добавить в фильтры" placement="top">
			<Chip
				className={classnames('flight-details-filters-chip', {'flight-details-filters-chip_active': isActive})}
				onDelete={isActive ? onDelete: null}
				label={label}
				onClick={!isActive ? onClick : null}
			/>
		</Tooltip>;
	}

	renderAirportFilter(airport: Airport, locationType: LocationType): React.ReactNode {
		const isActive = this.isFilterActive('airports', airport.IATA, locationType);

		return this.renderFilter(airport.name, isActive, locationType === LocationType.Departure ? this.onDepartureAirportClick : this.onArrivalAirportClick, () => {});
	}

	renderTimeFilter(time: Moment, locationType: LocationType): React.ReactNode {
		const isActive = this.isFilterActive('time', getTimeIntervalForDate(time), locationType),
				 label = getTimeIntervalName(getTimeIntervalForDate(time));

		return this.renderFilter(label, isActive, locationType === LocationType.Departure ? this.onDepartureTimeIntervalClick : this.onArrivalTimeIntervalClick, () => {});
	}

	renderAirlineFilter(airline: Airline, index: number): React.ReactNode {
		const isActive = this.isFilterActive('airlines', airline.IATA);

		const onClick: React.EventHandler<any> = event => {
			event.stopPropagation();
			event.preventDefault();

			this.onAirlineClick(airline);
		};

		return this.renderFilter(airline.name, isActive, onClick, () => {}, index);
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

			{this.renderAirportFilter(firstSegment.depAirport, LocationType.Departure)}
			{this.renderTimeFilter(firstSegment.depDate, LocationType.Departure)}

			<span className="flight-details-filters-label">Прилёт:</span>

			{this.renderAirportFilter(lastSegment.arrAirport, LocationType.Arrival)}
			{this.renderTimeFilter(lastSegment.arrDate, LocationType.Arrival)}

			<span className="flight-details-filters-label">Авиакомпании:</span>

			{allAirlines.map((airline, index) => (
				this.renderAirlineFilter(airline, index)
			))}
		</div>;
	}
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		filters: state.filters
	};
};

const mapDispatchToProps = {
	addAirline,
	addAirport,
	addTimeInterval
};

export default withSnackbar<OwnProps>(connect(mapStateToProps, mapDispatchToProps)(Filters));
