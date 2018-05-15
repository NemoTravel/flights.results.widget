import * as React from 'react';
import { connect } from 'react-redux';

import { SortingState } from '../store/sorting/reducers';
import SortingItem from './SortingItem';
import { setSorting, SortingAction } from '../store/sorting/actions';
import { SortingDirection, SortingType } from '../enums';
import { RootState } from '../store/reducers';

interface StateProps {
	currentSorting: SortingState;
}

interface DispatchProps {
	setSorting: (type: SortingType, direction: SortingDirection) => SortingAction;
}

type Props = StateProps & DispatchProps;

class Sorting extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.setSorting = this.setSorting.bind(this);
	}

	setSorting(type: SortingType, direction: SortingDirection): void {
		this.props.setSorting(type, direction);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.currentSorting.type !== nextProps.currentSorting.type ||
			this.props.currentSorting.direction !== nextProps.currentSorting.direction;
	}

	render(): React.ReactNode {
		const { currentSorting } = this.props;

		return <section className="sorting">
			<div className="sorting__left">
				<SortingItem
					type={SortingType.DepartureTime}
					isActive={currentSorting.type === SortingType.DepartureTime}
					direction={currentSorting.type === SortingType.DepartureTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>

				<SortingItem
					type={SortingType.FlightTime}
					isActive={currentSorting.type === SortingType.FlightTime}
					direction={currentSorting.type === SortingType.FlightTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>

				<SortingItem
					type={SortingType.ArrivalTime}
					isActive={currentSorting.type === SortingType.ArrivalTime}
					direction={currentSorting.type === SortingType.ArrivalTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>
			</div>

			<div className="sorting__middle"/>

			<div className="sorting__right">
				<SortingItem
					type={SortingType.Price}
					isActive={currentSorting.type === SortingType.Price}
					direction={currentSorting.type === SortingType.Price ? currentSorting.direction : SortingDirection.ASC}
					setSorting={this.setSorting}
				/>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		currentSorting: state.sorting
	};
};

const mapDispatchToProps = {
	setSorting
};

export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
