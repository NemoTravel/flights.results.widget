import * as React from 'react';
import * as classnames from 'classnames';
import FlightTakeOffIcon from 'material-ui-icons/FlightTakeoff';
import LegModel from '../../schemas/Leg';
import { LegAction } from '../../store/currentLeg/actions';
import { CommonThunkAction } from '../../state';
import Tooltip from 'material-ui/Tooltip';

interface Props {
	leg: LegModel;
	isDisabled: boolean;
	isSelected: boolean;
	isReverse: boolean;
	goToLeg: (legId: number) => CommonThunkAction;
}

class Leg extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.leg !== nextProps.leg ||
			this.props.isSelected !== nextProps.isSelected ||
			this.props.isDisabled !== nextProps.isDisabled ||
			this.props.isReverse !== nextProps.isReverse;
	}

	onClick(): void {
		const { leg, isDisabled, isSelected } = this.props;

		if (!isDisabled && !isSelected) {
			this.props.goToLeg(leg.id);
		}
	}

	render(): React.ReactNode {
		const { leg, isDisabled, isSelected, isReverse } = this.props;
		const classNames = classnames('toolbar-legs-leg', {
			'toolbar-legs-leg_disabled': isDisabled,
			'toolbar-legs-leg_selected': isSelected
		});

		return <div className={classNames} onClick={this.onClick}>
			<FlightTakeOffIcon className={classnames('toolbar-legs-leg__icon', { 'toolbar-legs-leg__icon_reverse': isReverse })}/>
			{leg.departure} &mdash; {leg.arrival}, {leg.date.format('DD MMMM')}

			<div className="toolbar-legs-leg__hidden">
				Изменить рейс
			</div>
		</div>;
	}
}

export default Leg;
