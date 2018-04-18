import * as React from 'react';
import { SortingDirection, SortingState, SortingType } from '../state';
import SortingItem from './SortingItem';

interface Props {
	currentSorting: SortingState;
	setSorting: (type: SortingType, direction: SortingDirection) => void;
}

class Sorting extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.currentSorting.type !== nextProps.currentSorting.type ||
			this.props.currentSorting.direction !== nextProps.currentSorting.direction;
	}

	render(): React.ReactNode {
		const { currentSorting, setSorting } = this.props;

		return <section className="sorting">
			<div className="sorting__left">
				<SortingItem
					type={SortingType.DepartureTime}
					isActive={currentSorting.type === SortingType.DepartureTime}
					direction={currentSorting.type === SortingType.DepartureTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={setSorting}
				/>

				<SortingItem
					type={SortingType.FlightTime}
					isActive={currentSorting.type === SortingType.FlightTime}
					direction={currentSorting.type === SortingType.FlightTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={setSorting}
				/>

				<SortingItem
					type={SortingType.ArrivalTime}
					isActive={currentSorting.type === SortingType.ArrivalTime}
					direction={currentSorting.type === SortingType.ArrivalTime ? currentSorting.direction : SortingDirection.ASC}
					setSorting={setSorting}
				/>
			</div>

			<div className="sorting__middle"/>

			<div className="sorting__right">
				<SortingItem
					type={SortingType.Price}
					isActive={currentSorting.type === SortingType.Price}
					direction={currentSorting.type === SortingType.Price ? currentSorting.direction : SortingDirection.ASC}
					setSorting={setSorting}
				/>
			</div>
		</section>;
	}
}

export default Sorting;
