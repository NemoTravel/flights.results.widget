import * as React from 'react';
import { connect } from 'react-redux';
import Price from './Price';
import Leg from '../schemas/Leg';
import { ApplicationState } from '../state';
import LegComponent from './Toolbar/Leg';

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

	shouldComponentUpdate(nextProps: StateProps): boolean {
		return nextProps.currentLeg !== this.props.currentLeg;
	}

	renderLeg(leg: Leg): React.ReactNode {
		const isDisabled = leg.id > this.props.currentLeg;
		const isSelected = leg.id < this.props.currentLeg;
		const isRTBack = leg.id === 1 && this.props.legs.length === NUM_OF_LEGS_FOR_RT;

		return <LegComponent key={leg.id} leg={leg} isDisabled={isDisabled} isSelected={isSelected} isReverse={isRTBack}/>;
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
