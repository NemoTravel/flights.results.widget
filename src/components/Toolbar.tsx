import * as React from 'react';
import { connect } from 'react-redux';
import Price from './Price';
import Leg from '../schemas/Leg';
import { ApplicationState, CommonThunkAction } from '../state';
import LegComponent from './Toolbar/Leg';
import Money from '../schemas/Money';
import { getTotalPrice } from '../store/selectedFlights/selectors';
import { goToLeg, LegAction } from '../store/currentLeg/actions';
import { bindActionCreators, Dispatch } from 'redux';

interface StateProps {
	totalPrice: Money;
	currentLeg: number;
	legs: Leg[];
}

interface DispatchProps {
	goToLeg: (legId: number) => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

const NUM_OF_LEGS_FOR_RT = 2;

class Toolbar extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.renderLeg = this.renderLeg.bind(this);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.currentLeg !== this.props.currentLeg || nextProps.totalPrice.amount !== this.props.totalPrice.amount;
	}

	renderLeg(leg: Leg): React.ReactNode {
		const isDisabled = leg.id > this.props.currentLeg;
		const isSelected = leg.id === this.props.currentLeg;
		const isRTBack = leg.id === 1 && this.props.legs.length === NUM_OF_LEGS_FOR_RT;

		return <LegComponent key={leg.id} leg={leg} goToLeg={this.props.goToLeg} isDisabled={isDisabled} isSelected={isSelected} isReverse={isRTBack}/>;
	}

	render(): React.ReactNode {
		return <section className="toolbar">
			<div className="toolbar__inner">
				<div className="toolbar-legs">
					{this.props.legs.map(this.renderLeg)}
				</div>

				<div className="toolbar-totalPrice">
					{this.props.totalPrice && this.props.totalPrice.amount ?
						<Price price={this.props.totalPrice}/> :
						'Выберите рейс'
					}
				</div>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		totalPrice: getTotalPrice(state),
		legs: state.legs,
		currentLeg: state.currentLeg
	};
};

const mapDispatchToProps = (dispatch: Dispatch<LegAction>): DispatchProps => {
	return {
		goToLeg: bindActionCreators(goToLeg, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
