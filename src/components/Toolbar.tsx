import * as React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

import Price from './Price';
import { RootState } from '../store/reducers';
import Money from '../schemas/Money';
import { goBack } from '../store/currentLeg/actions';
import { combinationsAreValid, getResultingFlightIds } from '../store/fareFamilies/selectors';
import { getTotalPrice } from '../store/selectors';
import { isLoadingFareFamilies } from '../store/isLoadingFareFamilies/selectors';
import { i18n } from '../i18n';
import { startActualization } from '../store/actions';
import autobind from 'autobind-decorator';

interface StateProps {
	totalPrice: Money;
	combinationsAreValid: boolean;
	isLoadingFareFamilies: boolean;
	resultingFlightIds: string[];
}

interface DispatchProps {
	goBack: typeof goBack;
	startActualization: typeof startActualization;
}

type Props = StateProps & DispatchProps;

class Toolbar extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.isLoadingFareFamilies !== this.props.isLoadingFareFamilies ||
			nextProps.combinationsAreValid !== this.props.combinationsAreValid ||
			nextProps.totalPrice.amount !== this.props.totalPrice.amount;
	}

	@autobind
	onProceed(): void {
		this.props.startActualization(this.props.resultingFlightIds);
	}

	render(): React.ReactNode {
		const { combinationsAreValid, isLoadingFareFamilies, totalPrice, goBack, startActualization } = this.props;

		return !isLoadingFareFamilies ? (
			<section className="toolbar">
				<div className="toolbar__inner">
					<Button className="toolbar__back" variant="raised" onClick={goBack}>{i18n('toolbar-backTitle')}</Button>

					<div className="toolbar-totalPrice">
						{combinationsAreValid && totalPrice.amount ? (
							<div className="toolbar-totalPrice__amount">
								<span className="toolbar-totalPrice__amount-prefix">{i18n('toolbar-totalPriceTitle')}</span>
								<Price price={totalPrice}/>
							</div>
						) : null}

						<div className="toolbar-totalPrice__button">
							<Tooltip className="toolbar-totalPrice__button-tooltip" open={!combinationsAreValid} title={<span className="tooltip">{i18n('toolbar-unavailableTitle')}</span>}>
								<Button variant="raised" color="secondary" disabled={!combinationsAreValid} onClick={this.onProceed}>
									{i18n('toolbar-continueTitle')}
								</Button>
							</Tooltip>
						</div>
					</div>
				</div>
			</section>
		) : null;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		totalPrice: getTotalPrice(state),
		isLoadingFareFamilies: isLoadingFareFamilies(state),
		combinationsAreValid: combinationsAreValid(state),
		resultingFlightIds: getResultingFlightIds(state)
	};
};

const mapDispatchToProps = {
	goBack,
	startActualization
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
