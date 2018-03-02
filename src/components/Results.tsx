import * as React from 'react';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

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
import Airport from '../schemas/Airport';
import Airline from '../schemas/Airline';
import Typography from 'material-ui/Typography';

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

interface State {
	snackbarIsVisible: boolean;
	snackbarLabel: string;
}

type Props = StateProps & DispatchProps;

const rowHeight = 72;
const snackbarAutohideTime = 5000;

const cache = new CellMeasurerCache({
	defaultHeight: rowHeight,
	fixedWidth: true
});

class Results extends React.Component<Props, State> {
	state: State = {
		snackbarIsVisible: false,
		snackbarLabel: ''
	};

	protected listComponent: any = null;

	constructor(props: Props) {
		super(props);

		this.flightRenderer = this.flightRenderer.bind(this);
		this.setSorting = this.setSorting.bind(this);
		this.onSnackbarClose = this.onSnackbarClose.bind(this);
		this.addAirportToFilters = this.addAirportToFilters.bind(this);
		this.addAirlineToFilters = this.addAirlineToFilters.bind(this);
	}

	componentDidMount(): void {
		this.props.startSearch();
	}

	showSnackbar(label: string): void {
		this.setState({
			snackbarIsVisible: true,
			snackbarLabel: label
		});
	}

	onSnackbarClose(): void {
		this.setState({
			snackbarIsVisible: false
		});
	}

	addAirportToFilters(airport: Airport, type: LocationType): void {
		this.props.addAirport(airport.IATA, type);
		this.showSnackbar(`Аэропорт «${airport.name}» был добавлен в фильтры`);
	}

	addAirlineToFilters(airline: Airline): void {
		this.props.addAirline(airline.IATA);
		this.showSnackbar(`Авиакомпания «${airline.name}» была добавлена в фильтры`);
	}

	setSorting(type: SortingType, direction: SortingDirection): void {
		this.props.setSorting(type, direction);
		this.listComponent.forceUpdateGrid();
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
						addAirport={this.addAirportToFilters}
						addAirline={this.addAirlineToFilters}
					/>
				</div>
			)}
		</CellMeasurer>;
	}

	render(): React.ReactNode {
		const { currentLeg, sorting } = this.props;
		const numOfFlights = this.props.flights.length;

		return <div>
			<Snackbar
				className="snackbar"
				open={this.state.snackbarIsVisible}
				autoHideDuration={snackbarAutohideTime}
				onClose={this.onSnackbarClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left'
				}}
				SnackbarContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={<span id="message-id">{this.state.snackbarLabel}</span>}
				action={[
					<IconButton
						className="snackbar-close"
						key="close"
						aria-label="Close"
						color="inherit"
						onClick={this.onSnackbarClose}
					>
						<CloseIcon />
					</IconButton>
				]}
			/>

			<section className="scenarios"/>

			<section className="filters">
				<div className="filters__left">
					<Typography variant="headline">
						Выберите рейс {currentLeg.departure} &mdash; {currentLeg.arrival}
					</Typography>
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
				<Sorting
					type={SortingType.DepartureTime}
					isActive={sorting.type === SortingType.DepartureTime}
					direction={sorting.type === SortingType.DepartureTime ? sorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>

				<Sorting
					type={SortingType.FlightTime}
					isActive={sorting.type === SortingType.FlightTime}
					direction={sorting.type === SortingType.FlightTime ? sorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>

				<Sorting
					type={SortingType.ArrivalTime}
					isActive={sorting.type === SortingType.ArrivalTime}
					direction={sorting.type === SortingType.ArrivalTime ? sorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>

				<Sorting
					type={SortingType.Price}
					isActive={sorting.type === SortingType.Price}
					direction={sorting.type === SortingType.Price ? sorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>
			</section>

			<WindowScroller>
				{({ height, isScrolling, onChildScroll, scrollTop }) => (
					<div>
						<AutoSizer disableHeight>
							{({ width }) => (
								<List
									autoHeight
									ref={component => this.listComponent = component}
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
