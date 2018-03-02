import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Button from 'material-ui/Button';

import Price from './Price';
import Leg from '../schemas/Leg';
import { ApplicationState, CommonThunkAction } from '../state';
import LegComponent from './Toolbar/Leg';
import OptionsLegComponent from './Toolbar/OptionsLeg';
import Money from '../schemas/Money';
import { getTotalPrice, isSelectionComplete } from '../store/selectedFlights/selectors';
import { goToLeg, LegAction } from '../store/currentLeg/actions';
import { combinationsAreValid } from '../store/alternativeFlights/selectors';

interface StateProps {
	totalPrice: Money;
	isSelectionComplete: boolean;
	currentLeg: number;
	combinationsAreValid: boolean;
	legs: Leg[];
}

interface DispatchProps {
	goToLeg: (legId: number) => CommonThunkAction;
}

type Props = StateProps & DispatchProps;

// const NUM_OF_LEGS_FOR_RT = 2;

class Toolbar extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.renderLeg = this.renderLeg.bind(this);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.currentLeg !== this.props.currentLeg || nextProps.totalPrice.amount !== this.props.totalPrice.amount;
	}

	renderLeg(leg: Leg): React.ReactNode {
		const { currentLeg, isSelectionComplete } = this.props;
		const isDisabled = leg.id > currentLeg;
		const isSelected = !isSelectionComplete && leg.id === currentLeg;
		// const isRTBack = leg.id === 1 && legs.length === NUM_OF_LEGS_FOR_RT;

		return <LegComponent
			key={leg.id}
			leg={leg}
			goToLeg={this.props.goToLeg}
			isDisabled={isDisabled}
			isSelected={isSelected}
			isReverse={false}
		/>;
	}

	renderPrice(): React.ReactNode {
		const { isSelectionComplete, combinationsAreValid, totalPrice } = this.props;
		let result: React.ReactNode = null;

		if (isSelectionComplete) {
			result = combinationsAreValid && totalPrice.amount ? <Price price={totalPrice}/> : <div>Недоступная комбинация</div>;
		}
		else {
			if (totalPrice.amount) {
				result = <Price price={totalPrice}/>;
			}
		}

		return result;
	}

	render(): React.ReactNode {
		const { isSelectionComplete, combinationsAreValid } = this.props;

		return <section className="toolbar">
			<div className="toolbar__inner">
				<div className="toolbar-legs">
					{this.props.legs.map(this.renderLeg)}

					<OptionsLegComponent
						isDisabled={!isSelectionComplete}
						isSelected={isSelectionComplete}
					/>
				</div>

				<div className="toolbar-totalPrice">
					{this.renderPrice()}

					{isSelectionComplete ? (
						<div className="toolbar-totalPrice__button">
							<Button variant="raised" color="secondary" disabled={!combinationsAreValid}>
								Купить
							</Button>
						</div>
					) : ''}
				</div>
			</div>
		</section>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		totalPrice: getTotalPrice(state),
		legs: state.legs,
		currentLeg: state.currentLeg,
		combinationsAreValid: combinationsAreValid(state),
		isSelectionComplete: isSelectionComplete(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<LegAction>): DispatchProps => {
	return {
		goToLeg: bindActionCreators(goToLeg, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
