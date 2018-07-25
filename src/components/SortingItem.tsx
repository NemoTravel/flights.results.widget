import * as React from 'react';
import * as classnames from 'classnames';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';

import { setSorting } from '../store/sorting/actions';
import { ScreenMaxSize, SortingDirection, SortingType } from '../enums';
import { i18n } from '../i18n';
import MediaQuery from 'react-responsive';

interface Props {
	isActive?: boolean;
	direction?: SortingDirection;
	type: SortingType;
	setSorting: typeof setSorting;
}

class SortingItem extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isActive: false,
		direction: SortingDirection.ASC
	};

	constructor(props: Props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return (
			this.props.isActive !== nextProps.isActive ||
			this.props.type !== nextProps.type ||
			this.props.direction !== nextProps.direction
		);
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
		const classNames = classnames(`sorting-item sorting-item_${direction} sorting-item_${type}`, { 'sorting-item_active': isActive });

		const sortingLabels = {
			[SortingType.Price]: i18n('sorting-title_price'),
			[SortingType.DepartureTime]: i18n('sorting-title_departure'),
			[SortingType.ArrivalTime]: i18n('sorting-title_arrival'),
			[SortingType.FlightTime]: i18n('sorting-title_flightTime')
		};

		return <div className={classNames}>
			<div className="sorting-item__inner">
				<span className="sorting-item__text" onClick={this.onClick}>
					{sortingLabels[type]}
				</span>

				<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
					<span className="sorting-item__arrow">
						<ArrowDown/>
					</span>
				</MediaQuery>

				<MediaQuery maxDeviceWidth={ScreenMaxSize.Tablet}>
					<span className="sorting-item-arrows">
						<div className="sorting-item-arrows__up">
							<ArrowUp/>
						</div>
						<div className="sorting-item-arrows__down">
							<ArrowDown/>
						</div>
					</span>
				</MediaQuery>
			</div>
		</div>;
	}
}

export default SortingItem;
