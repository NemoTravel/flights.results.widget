import * as React from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps, WindowScroller } from 'react-virtualized';

import FlightModel from '../schemas/Flight';
import Flight from './Flight';
import { ApplicationState, CommonThunkAction, LocationType } from '../state';
import { addAirline, FilterAirlinesAction } from '../store/filters/airlines/actions';
import { addAirport, FilterAirportsAction } from '../store/filters/airports/actions';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { selectFlight } from '../store/selectedFlights/actions';
import Airport from '../schemas/Airport';
import Airline from '../schemas/Airline';
import { isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import { getPricesForCurrentLeg, getVisibleFlights, PricesByFlights } from '../store/selectors';

export interface OwnProps {
	legId: number;
	showSnackbar: (label: string) => void;
}

interface StateProps {
	prices: PricesByFlights;
	flights: FlightModel[];
	isMultipleLegs: boolean;
	isLastLeg: boolean;
}

interface DispatchProps {
	addAirline: (IATA: string) => FilterAirlinesAction;
	addAirport: (IATA: string, type: LocationType) => FilterAirportsAction;
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
}

type Props = OwnProps & StateProps & DispatchProps;

const rowHeight = 72;

const cache = new CellMeasurerCache({
	defaultHeight: rowHeight,
	fixedWidth: true
});

class FlightsList extends React.Component<Props> {
	protected listComponent: any = null;

	constructor(props: Props) {
		super(props);

		this.flightRenderer = this.flightRenderer.bind(this);
		this.selectFlight = this.selectFlight.bind(this);
		this.addAirportToFilters = this.addAirportToFilters.bind(this);
		this.addAirlineToFilters = this.addAirlineToFilters.bind(this);
	}

	updateGrid(): void {
		this.listComponent.forceUpdateGrid();
	}

	selectFlight(flightId: number, legId: number): void {
		this.props.selectFlight(flightId, legId);

		if (!this.props.isLastLeg) {
			this.props.showSnackbar('Выберите рейс на следующее направление');
		}
	}

	addAirportToFilters(airport: Airport, type: LocationType): void {
		this.props.addAirport(airport.IATA, type);
		this.props.showSnackbar(`Аэропорт «${airport.name}» был добавлен в фильтры`);

		setTimeout(() => {
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}, 0);
	}

	addAirlineToFilters(airline: Airline): void {
		this.props.addAirline(airline.IATA);
		this.props.showSnackbar(`Авиакомпания «${airline.name}» была добавлена в фильтры`);

		setTimeout(() => {
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}, 0);
	}

	flightRenderer({ index, isScrolling, key, style, parent }: ListRowProps): React.ReactNode {
		const { legId, prices } = this.props;
		const flight = this.props.flights[index];

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
						price={prices[flight.id]}
						flight={flight}
						selectFlight={this.selectFlight}
						currentLegId={legId}
						showPricePrefix={!this.props.isLastLeg && this.props.isMultipleLegs}
						addAirport={this.addAirportToFilters}
						addAirline={this.addAirlineToFilters}
					/>
				</div>
			)}
		</CellMeasurer>;
	}

	componentWillUpdate(nextProps: Props): void {
		if (this.listComponent && nextProps.prices !== this.props.prices) {
			this.updateGrid();
		}
	}

	renderNoFlights(): JSX.Element {
		return <Typography variant="headline">Нет результатов.</Typography>;
	}

	render(): React.ReactNode {
		const numOfFlights = this.props.flights.length;

		return <WindowScroller>
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
								noRowsRenderer={this.renderNoFlights}
							/>
						)}
					</AutoSizer>
				</div>
			)}
		</WindowScroller>;
	}
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps): OwnProps & StateProps => {
	return {
		...ownProps,
		prices: getPricesForCurrentLeg(state),
		flights: getVisibleFlights(state),
		isMultipleLegs: isMultipleLegs(state),
		isLastLeg: isLastLeg(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		addAirline: bindActionCreators(addAirline, dispatch),
		addAirport: bindActionCreators(addAirport, dispatch),
		selectFlight: bindActionCreators(selectFlight, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(FlightsList);
