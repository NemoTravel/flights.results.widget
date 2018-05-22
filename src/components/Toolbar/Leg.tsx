import * as React from 'react';
import * as classnames from 'classnames';
import FlightTakeOffIcon from '@material-ui/icons/FlightTakeoff';

import LegModel from '../../schemas/Leg';
import { goToLeg } from '../../store/currentLeg/actions';

interface Props {
	isDisabled: boolean;
	isSelected: boolean;
	leg?: LegModel;
	isReverse?: boolean;
	goToLeg?: typeof goToLeg;
}

class Leg extends React.Component<Props> {
	static defaultProps: Partial<Props> = {
		isReverse: false
	};

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

			setTimeout(() => {
				window.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			}, 0);
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
			{leg.departure.city.name} &mdash; {leg.arrival.city.name}

			<div className="toolbar-legs-leg__hidden">
				Изменить рейс
			</div>
		</div>;
	}
}

export default Leg;
