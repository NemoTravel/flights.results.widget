import * as React from 'react';
import * as classnames from 'classnames';
import FlightTakeOffIcon from 'material-ui-icons/FlightTakeoff';
import LegModel from '../../schemas/Leg';

interface Props {
	leg: LegModel;
	isDisabled: boolean;
	isSelected: boolean;
	isReverse: boolean;
}

class Leg extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.leg !== nextProps.leg ||
			this.props.isSelected !== nextProps.isSelected ||
			this.props.isDisabled !== nextProps.isDisabled ||
			this.props.isReverse !== nextProps.isReverse;
	}

	render(): React.ReactNode {
		const { leg, isDisabled, isSelected, isReverse } = this.props;
		const classNames = classnames('toolbar-legs-leg', {
			'toolbar-legs-leg_disabled': isDisabled,
			'toolbar-legs-leg_selected': isSelected
		});

		return <div className={classNames}>
			<FlightTakeOffIcon className={classnames('toolbar-legs-leg__icon', { 'toolbar-legs-leg__icon_reverse': isReverse })}/>
			{leg.departure} &mdash; {leg.arrival}, {leg.date.format('DD MMMM')}
		</div>;
	}
}

export default Leg;