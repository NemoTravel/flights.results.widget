import * as React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Typography from 'material-ui/Typography';

import AirlineFilter from './Filters/Airlines';
import AirportsFilter from './Filters/Airports';
import DirectOnlyFilter from './Filters/DirectOnly';
import TimeFilter from './Filters/Time';
import { getCurrentLeg, getLegs } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { ApplicationState, CommonThunkAction, SortingDirection, SortingState, SortingType } from '../state';
import { startSearch } from '../store/actions';
import Sorting from './Sorting';
import { setSorting, SortingAction } from '../store/sorting/actions';
import FlightsListComponent from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';

interface StateProps {
	sorting: SortingState;
	isLoading: boolean;
	hasAnyFlights: boolean;
	currentLeg: Leg;
	legs: Leg[];
}

interface DispatchProps {
	setSorting: (type: SortingType, direction: SortingDirection) => SortingAction;
	startSearch: () => CommonThunkAction;
}

interface State {
	snackbarIsVisible: boolean;
	snackbarLabel: string;
}

type Props = StateProps & DispatchProps;

const snackbarAutohideTime = 5000;

class Results extends React.Component<Props, State> {
	state: State = {
		snackbarIsVisible: false,
		snackbarLabel: ''
	};

	protected flightsLists: { [legId: string]: any } = {};

	constructor(props: Props) {
		super(props);

		this.setSorting = this.setSorting.bind(this);
		this.showSnackbar = this.showSnackbar.bind(this);
		this.onSnackbarClose = this.onSnackbarClose.bind(this);
	}

	componentDidMount(): void {
		if (!this.props.hasAnyFlights) {
			this.props.startSearch();
		}
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

	setSorting(type: SortingType, direction: SortingDirection): void {
		this.props.setSorting(type, direction);
		this.flightsLists[this.props.currentLeg.id].wrappedInstance.updateGrid();
	}

	render(): React.ReactNode {
		const { currentLeg, sorting, legs } = this.props;

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

			{legs.map(({ id }) => (
				<FlightsListComponent
					ref={component => this.flightsLists[id] = component}
					key={id}
					isVisible={currentLeg.id === id}
					legId={id}
					showSnackbar={this.showSnackbar}
				/>
			))}
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		legs: getLegs(state),
		sorting: state.sorting,
		isLoading: state.isLoading,
		hasAnyFlights: hasAnyFlights(state),
		currentLeg: getCurrentLeg(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		setSorting: bindActionCreators(setSorting, dispatch),
		startSearch: bindActionCreators(startSearch, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
