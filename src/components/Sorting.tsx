import * as React from 'react';
import * as classnames from 'classnames';
import ArrowDown from 'material-ui-icons/ArrowDownward';

import { SortingDirection, SortingType } from '../state';
import { SortingAction } from '../store/sorting/actions';

interface Props {
	isActive?: boolean;
	type: SortingType;
	direction: SortingDirection;
	setSorting: (type: SortingType, direction: SortingDirection) => SortingAction;
}

const sortingLabels = {
	[SortingType.Price]: 'Стоимость',
	[SortingType.DepartureTime]: 'Вылет',
	[SortingType.ArrivalTime]: 'Прилет',
	[SortingType.FlightTime]: 'В пути'
};

class Sorting extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isActive: false
	};

	render(): React.ReactNode {
		const { type, direction, isActive } = this.props;

		return <div className={classnames(`sorting-item sorting-item_${direction} sorting-item_${type}`, { 'sorting-item_active': isActive })}>
			<span className="sorting-item__text">
				{sortingLabels[type]}
			</span>

			<span className="sorting-item__arrow">
				<ArrowDown/>
			</span>
		</div>;
	}
}

export default Sorting;
