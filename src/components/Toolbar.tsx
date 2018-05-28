import * as React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Price from './Price';
import { RootState } from '../store/reducers';
import Money from '../schemas/Money';
import { goBack } from '../store/currentLeg/actions';
import { combinationsAreValid } from '../store/fareFamilies/selectors';
import Tooltip from '@material-ui/core/Tooltip';
import { getTotalPrice } from '../store/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';

interface StateProps {
	totalPrice: Money;
	combinationsAreValid: boolean;
	isLoadingFareFamilies: boolean;
}

interface DispatchProps {
	goBack: typeof goBack;
}

type Props = StateProps & DispatchProps;

class Toolbar extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.isLoadingFareFamilies !== this.props.isLoadingFareFamilies ||
			nextProps.combinationsAreValid !== this.props.combinationsAreValid ||
			nextProps.totalPrice.amount !== this.props.totalPrice.amount;
	}

	render(): React.ReactNode {
		const { combinationsAreValid, isLoadingFareFamilies, totalPrice, goBack } = this.props;

		return <section className="toolbar">
			<div className="toolbar__inner">
				{!isLoadingFareFamilies ? <>
					<Button variant="raised" onClick={goBack}>Назад</Button>

					<div className="toolbar-totalPrice">
						{combinationsAreValid && totalPrice.amount ? (
							<div className="toolbar-totalPrice__amount">
								<span className="toolbar-totalPrice__amount-prefix">итого</span>
								<Price price={totalPrice}/>
							</div>
						) : null}

						<div className="toolbar-totalPrice__button">
							<Tooltip className="toolbar-totalPrice__button-tooltip" open={!combinationsAreValid} title="Недоступная комбинация">
								<Button variant="raised" color="secondary" disabled={!combinationsAreValid}>
									Продолжить
								</Button>
							</Tooltip>
						</div>
					</div>
				</> : null}
			</div>
		</section>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		totalPrice: getTotalPrice(state),
		isLoadingFareFamilies: isLoadingFareFamilies(state),
		combinationsAreValid: combinationsAreValid(state)
	};
};

const mapDispatchToProps = {
	goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
