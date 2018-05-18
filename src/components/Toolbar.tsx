import * as React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';

import Price from './Price';
import Leg from '../schemas/Leg';
import { RootState } from '../store/reducers';
import LegComponent from './Toolbar/Leg';
import OptionsLegComponent from './Toolbar/OptionsLeg';
import Money from '../schemas/Money';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import { goToLeg } from '../store/currentLeg/actions';
import { combinationsAreValid } from '../store/fareFamilies/selectors';
import Tooltip from 'material-ui/Tooltip';
import { getTotalPrice } from '../store/selectors';
import { hasAnyFlights } from '../store/flights/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { isRT } from '../store/legs/selectors';

interface StateProps {
	totalPrice: Money;
	isSelectionComplete: boolean;
	currentLeg: number;
	combinationsAreValid: boolean;
	legs: Leg[];
	isRT: boolean;
	isLoadingFareFamilies: boolean;
	hasAnyFlights: boolean;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
}

type Props = StateProps & DispatchProps;

class Toolbar extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.renderLeg = this.renderLeg.bind(this);
	}

	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.currentLeg !== this.props.currentLeg ||
			nextProps.hasAnyFlights !== this.props.hasAnyFlights ||
			nextProps.legs !== this.props.legs ||
			nextProps.isSelectionComplete !== this.props.isSelectionComplete ||
			nextProps.isLoadingFareFamilies !== this.props.isLoadingFareFamilies ||
			nextProps.combinationsAreValid !== this.props.combinationsAreValid ||
			nextProps.totalPrice.amount !== this.props.totalPrice.amount;
	}

	renderLeg(leg: Leg): React.ReactNode {
		const { currentLeg, isSelectionComplete, isRT } = this.props;
		const isDisabled = leg.id > currentLeg;
		const isSelected = !isSelectionComplete && leg.id === currentLeg;

		return <LegComponent
			key={leg.id}
			leg={leg}
			goToLeg={this.props.goToLeg}
			isDisabled={isDisabled}
			isSelected={isSelected}
			isReverse={leg.id === 1 && isRT}
		/>;
	}

	renderPrice(): React.ReactNode {
		const { isSelectionComplete, combinationsAreValid, totalPrice } = this.props;
		let result: React.ReactNode = null;

		if (isSelectionComplete) {
			result = combinationsAreValid && totalPrice.amount ? <Price price={totalPrice}/> : null;
		}
		else {
			if (totalPrice.amount) {
				result = <Price price={totalPrice}/>;
			}
		}

		return result;
	}

	render(): React.ReactNode {
		const { isSelectionComplete, combinationsAreValid, hasAnyFlights, isLoadingFareFamilies } = this.props;

		return hasAnyFlights ? <section className="toolbar">
			<div className="toolbar__inner">
				<div className="toolbar-legs">
					{this.props.legs.map(this.renderLeg)}

					<OptionsLegComponent
						isDisabled={!isSelectionComplete}
						isSelected={isSelectionComplete}
					/>
				</div>

				{!isSelectionComplete || !isLoadingFareFamilies ? (
					<div className="toolbar-totalPrice">
						{this.renderPrice()}

						{isSelectionComplete ? (
							<div className="toolbar-totalPrice__button">
								<Tooltip className="toolbar-totalPrice__button-tooltip" open={!combinationsAreValid} title="Недоступная комбинация">
									<Button variant="raised" color="secondary" disabled={!combinationsAreValid}>
										Продолжить
									</Button>
								</Tooltip>
							</div>
						) : ''}
					</div>
				) : null}
			</div>
		</section> : null;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		totalPrice: getTotalPrice(state),
		legs: state.legs,
		isRT: isRT(state),
		isLoadingFareFamilies: isLoadingFareFamilies(state),
		currentLeg: state.currentLeg,
		hasAnyFlights: hasAnyFlights(state),
		combinationsAreValid: combinationsAreValid(state),
		isSelectionComplete: isSelectionComplete(state)
	};
};

const mapDispatchToProps = {
	goToLeg
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
