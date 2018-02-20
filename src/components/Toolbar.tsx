import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import FlightTakeOffIcon from 'material-ui-icons/FlightTakeoff';
import Price from './Price';
import Leg from '../schemas/Leg';
import { ApplicationState } from '../state';

interface StateProps {
	currentLeg: number;
	legs: Leg[];
}

const NUM_OF_LEGS_FOR_RT = 2;

class Toolbar extends React.Component<StateProps> {
	constructor(props: StateProps) {
		super(props);

		this.renderLeg = this.renderLeg.bind(this);
	}

	renderLeg(leg: Leg): React.ReactNode {
		const isDisabled = leg.id > this.props.currentLeg;
		const isSelected = leg.id < this.props.currentLeg;
		const isRTBack = leg.id === 1 && this.props.legs.length === NUM_OF_LEGS_FOR_RT;
		const classNames = classnames('toolbar-legs-leg', {
			'toolbar-legs-leg_disabled': isDisabled,
			'toolbar-legs-leg_selected': isSelected
		});

		return <div key={leg.id} className={classNames}>
			<FlightTakeOffIcon className={classnames('toolbar-legs-leg__icon', { 'toolbar-legs-leg__icon_reverse': isRTBack })}/>
			{leg.departure} &mdash; {leg.arrival}, {leg.date.format('DD MMMM')}
		</div>;
	}

	render(): React.ReactNode {
		return <section className="toolbar">
			<div className="toolbar__inner">
				<div className="toolbar-legs">
					{this.props.legs.map(this.renderLeg)}
				</div>

				<div className="toolbar-totalPrice">
					<Price price={{ amount: 1336, currency: 'RUB' }}/>
				</div>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		legs: state.legs,
		currentLeg: state.currentLeg
	};
};

export default connect(mapStateToProps)(Toolbar);
