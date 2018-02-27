import * as React from 'react';
import Toolbar from './Toolbar';
import Typography from 'material-ui/Typography';

import Flight from './Flight';
import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import { getCurrentLeg, isLastLeg, isMultipleLegs } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { ApplicationState, CommonThunkAction } from '../state';
import { CellMeasurerCache, ListRowProps, CellMeasurer, WindowScroller, AutoSizer, List } from 'react-virtualized';
import FlightModel from '../schemas/Flight';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { getVisibleFlights } from '../store/selectors';
import { connect } from 'react-redux';
import { selectFlight } from '../store/selectedFlights/actions';
import { startSearch } from '../store/actions';

interface StateProps {
	isMultipleLegs: boolean;
	isLastLeg: boolean;
	isLoading: boolean;
	flights: FlightModel[];
	currentLeg: Leg;
}

interface DispatchProps {
	selectFlight: (flightId: number, legId: number) => CommonThunkAction;
	startSearch: () => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

const rowHeight = 72;

const cache = new CellMeasurerCache({
	defaultHeight: rowHeight,
	fixedWidth: true
});

const PLURAL_MULTIPLE_NUM = 5;
const PLURAL_EXCEPTION_START = 11;
const PLURAL_EXCEPTION_END = 15;

const getPluralNumOfFlights = (numOfFlights: number): string => {
	const lastNumber = parseInt(numOfFlights.toString()[numOfFlights.toString().length - 1]);

	if (lastNumber === 0 || lastNumber >= PLURAL_MULTIPLE_NUM || (numOfFlights >= PLURAL_EXCEPTION_START && numOfFlights < PLURAL_EXCEPTION_END)) {
		return 'рейсов';
	}
	else if (lastNumber === 1) {
		return 'рейс';
	}
	else {
		return 'рейса';
	}
};

const getPluralHeadline = (numOfFlights: number): string => {
	const lastNumber = parseInt(numOfFlights.toString()[numOfFlights.toString().length - 1]);

	if (lastNumber === 1 && numOfFlights !== PLURAL_EXCEPTION_START) {
		return 'Найден';
	}
	else {
		return 'Найдено';
	}
};

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
					/>
				</div>
			)}
		</CellMeasurer>;
	}

	render(): React.ReactNode {
		const { currentLeg } = this.props;
		const numOfFlights = this.props.flights.length;

		return <div>
			<section className="scenarios"/>

			<section className="filters">
				<DirectOnlyFilter/>
				<AirlineFilter/>
				<AirportsFilter/>
				<TimeFilter/>
			</section>

			<Typography className="results__headline" paragraph={true}>
				{getPluralHeadline(numOfFlights)} {numOfFlights} {getPluralNumOfFlights(numOfFlights)} по направлению {currentLeg.departure} &mdash; {currentLeg.arrival}.
			</Typography>

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
		isMultipleLegs: isMultipleLegs(state),
		isLastLeg: isLastLeg(state),
		isLoading: state.isLoading,
		flights: getVisibleFlights(state),
		currentLeg: getCurrentLeg(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		selectFlight: bindActionCreators(selectFlight, dispatch),
		startSearch: bindActionCreators(startSearch, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
