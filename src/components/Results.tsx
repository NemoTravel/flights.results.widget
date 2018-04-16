import * as React from 'react';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';

import { getCurrentLeg, getLegs } from '../store/currentLeg/selectors';
import Leg from '../schemas/Leg';
import { ApplicationState, SortingDirection, SortingState, SortingType } from '../state';
import { setSorting, SortingAction } from '../store/sorting/actions';
import FlightsListComponent from './FlightsList';
import { hasAnyFlights } from '../store/flights/selectors';
import Sortings from './Sortings';
import Filters from './Filters';
import Snackbar from './Snackbar';

interface StateProps {
	sorting: SortingState;
	isLoading: boolean;
	hasAnyFlights: boolean;
	currentLeg: Leg;
	legs: Leg[];
}

interface DispatchProps {
	setSorting: (type: SortingType, direction: SortingDirection) => SortingAction;
}

type Props = StateProps & DispatchProps;

class Results extends React.Component<Props> {
	protected snackbar: Snackbar = null;
	protected flightsLists: { [legId: string]: any } = {};

	constructor(props: Props) {
		super(props);

		this.setSorting = this.setSorting.bind(this);
		this.showSnackbar = this.showSnackbar.bind(this);
	}

	showSnackbar(label: string): void {
		this.snackbar.showSnackbar(label);
	}

	setSorting(type: SortingType, direction: SortingDirection): void {
		this.props.setSorting(type, direction);
		this.updateCurrentGrid();
	}

	updateCurrentGrid(): void {
		this.flightsLists[this.props.currentLeg.id].wrappedInstance.updateGrid();
	}

	render(): React.ReactNode {
		const { currentLeg, sorting, legs } = this.props;

		return <div className="results__inner-content">
			<Snackbar ref={component => this.snackbar = component}/>

			<Filters currentLeg={currentLeg}/>
			<Sortings currentSorting={sorting} setSorting={this.setSorting}/>

			<SwipeableViews index={currentLeg.id}>
				{legs.map(({ id }) => (
					<FlightsListComponent
						ref={component => this.flightsLists[id] = component}
						key={id}
						legId={id}
						showSnackbar={this.showSnackbar}
					/>
				))}
			</SwipeableViews>
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
		setSorting: bindActionCreators(setSorting, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);
