import * as React from 'react';
import * as classnames from 'classnames';
import ArrowDown from 'material-ui-icons/ArrowDownward';

import { SortingDirection, SortingType } from '../state';

interface Props {
	isActive?: boolean;
	direction?: SortingDirection;
	type: SortingType;
	setSorting: (type: SortingType, direction: SortingDirection) => void;
}

const sortingLabels = {
	[SortingType.Price]: 'Стоимость',
	[SortingType.DepartureTime]: 'Вылет',
	[SortingType.ArrivalTime]: 'Прилет',
	[SortingType.FlightTime]: 'В пути'
};

class Sorting extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isActive: false,
		direction: SortingDirection.ASC
	};

	constructor(props: Props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(): void {
		let direction = this.props.direction;

		if (this.props.isActive) {
			direction = this.props.direction === SortingDirection.DESC ? SortingDirection.ASC : SortingDirection.DESC;
		}

		this.props.setSorting(this.props.type, direction);
	}

	render(): React.ReactNode {
		const { type, direction, isActive } = this.props;

		return <div className={classnames(`sorting-item sorting-item_${direction} sorting-item_${type}`, { 'sorting-item_active': isActive })}>
			<span className="sorting-item__text" onClick={this.onClick}>
				{sortingLabels[type]}
			</span>

			<span className="sorting-item__arrow">
				<ArrowDown/>
			</span>
		</div>;
	}
}

export default Sorting;
