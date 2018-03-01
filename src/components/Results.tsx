import * as React from 'react';

import Flight from './Flight';
import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import { getCurrentLeg, isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import {
	ApplicationState, CommonThunkAction, LocationType, SortingDirection, SortingState,
	SortingType
} from '../state';
import { CellMeasurerCache, ListRowProps, CellMeasurer, WindowScroller, AutoSizer, List } from 'react-virtualized';
import FlightModel from '../schemas/Flight';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { getVisibleFlights } from '../store/selectors';
import { connect } from 'react-redux';
import { selectFlight } from '../store/selectedFlights/actions';
import { startSearch } from '../store/actions';
import { addAirport, FilterAirportsAction } from '../store/filters/airports/actions';
import { addAirline, FilterAirlinesAction } from '../store/filters/airlines/actions';
import Sorting from './Sorting';
import { setSorting, SortingAction } from '../store/sorting/actions';

interface StateProps {
	sorting: SortingState;
	isMultipleLegs: boolean;
	isLastLeg: boolean;
	isLoading: boolean;
	flights: FlightModel[];
	currentLeg: Leg;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	addAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
	setSorting: (type: SortingType, direction: SortingDirection) => SortingAction;
	startSearch: () => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

const rowHeight = 72;

const cache = new CellMeasurerCache({
	defaultHeight: rowHeight,
	fixedWidth: true
});

class Results extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.flightRenderer = this.flightRenderer.bind(this);
	}

	componentDidMount(): void {
		this.props.startSearch();
	}

	flightRenderer({ index, isScrolling, key, style, parent }: ListRowProps): React.ReactNode {
		return <CellMeasurer
			cache={cache}
			columnIndex={0}
			key={key}
			parent={parent as any}
			rowIndex={index}
		>
			{({ measure }) => (
				<div className="flight__holder" style={style}>
					<Flight
						onLoad={measure}
						key={key}
						flight={this.props.flights[index]}
						selectFlight={this.props.selectFlight}
						currentLegId={this.props.currentLeg.id}
						isLastLeg={this.props.isLastLeg}
						isMultipleLegs={this.props.isMultipleLegs}
						addAirport={this.props.addAirport}
						addAirline={this.props.addAirline}
					/>
				</div>
			)}
		</CellMeasurer>;
	}

	render(): React.ReactNode {
		const { currentLeg, sorting } = this.props;
		const numOfFlights = this.props.flights.length;

		return <div>
			<section className="scenarios"/>

			<section className="filters">
				<div className="filters__left">
					<span className="filters-routeInfo">
						Выберите рейс {currentLeg.departure} &mdash; {currentLeg.arrival}
					</span>
				</div>

				<div className="filters__right">
					<span className="filters-title">Фильтры</span>

					<DirectOnlyFilter/>
					<AirlineFilter/>
					<AirportsFilter/>
					<TimeFilter/>
				</div>
			</section>

			<section className="sorting">
				<Sorting type={SortingType.DepartureTime} isActive={sorting.type === SortingType.DepartureTime} direction={SortingDirection.ASC} setSorting={this.props.setSorting}/>
				<Sorting type={SortingType.FlightTime} isActive={sorting.type === SortingType.FlightTime} direction={SortingDirection.ASC} setSorting={this.props.setSorting}/>
				<Sorting type={SortingType.ArrivalTime} isActive={sorting.type === SortingType.ArrivalTime} direction={SortingDirection.ASC} setSorting={this.props.setSorting}/>
				<Sorting type={SortingType.Price} isActive={sorting.type === SortingType.Price} direction={SortingDirection.ASC} setSorting={this.props.setSorting}/>
			</section>

			<WindowScroller>
				{({ height, isScrolling, onChildScroll, scrollTop }) => (
					<div>
						<AutoSizer disableHeight>
							{({ width }) => (
								<List
									autoHeight
									deferredMeasurementCache={cache}
									height={height}
									width={width}
									isScrolling={isScrolling}
									scrollTop={scrollTop}
									onScroll={onChildScroll}
									rowCount={numOfFlights}
									rowHeight={cache.rowHeight}
									rowRenderer={this.flightRenderer}
								/>
							)}
						</AutoSizer>
					</div>
				)}
			</WindowScroller>
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		sorting: state.sorting,
		isMultipleLegs: isMultipleLegs(state),
		isLastLeg: isLastLeg(state),
		isLoading: state.isLoading,
		flights: getVisibleFlights(state),
		currentLeg: getCurrentLeg(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		addAirport: bindActionCreators(addAirport, dispatch),
		selectFlight: bindActionCreators(selectFlight, dispatch),
		setSorting: bindActionCreators(setSorting, dispatch),
		startSearch: bindActionCreators(startSearch, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
