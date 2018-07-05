import * as React from 'react';
import autobind from 'autobind-decorator';
import Button from '@material-ui/core/Button';

import { ActualizationProblem } from '../../store/actualization/reducers';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';
import { RootState } from '../../store/reducers';
import { goToLeg } from '../../store/currentLeg/actions';
import { connect } from 'react-redux';
import { i18n } from '../../i18n';
import DialogMessage from '../DialogMessage';
import Price from '../Price';
import { getNemoURL } from '../../store/config/selectors';
import { clearActualizationProblems } from '../../store/actualization/actions';

export interface StateProps {
	problem: ActualizationProblem;
	info: AvailabilityInfo[];
	nemoURL: string;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
	clearActualizationProblems: typeof clearActualizationProblems;
}

class ErrorHandler extends React.Component<StateProps & DispatchProps> {
	renderHeader(): React.ReactNode {
		return <>{i18n(`error-actualization-${this.props.problem}_header`)}</>;
	}

	renderContent(): React.ReactNode {
		let contentText = i18n(`error-actualization-${this.props.problem}`);

		if (this.props.problem === ActualizationProblem.Price) {
			return <>
				{contentText}
				<Price price={this.props.info[this.props.info.length - 1].priceInfo.newPrice}/>
			</>;
		}
		else if (this.props.problem === ActualizationProblem.Availability) {
			const firstModifiedFlight = this.props.info[0].flight;

			contentText = contentText.replace('%-departure-%', firstModifiedFlight.firstSegment.depAirport.city.name)
				.replace('%-arrival-%', firstModifiedFlight.lastSegment.arrAirport.city.name)
				.replace('%-airline-%', firstModifiedFlight.validatingCarrier.name);
		}

		return <>{contentText}</>;
	}

	@autobind
	changeFlight(): void {
		this.props.clearActualizationProblems();
		this.props.goToLeg(0);
	}

	@autobind
	goToBooking(): void {
		if (this.props.info.length) {
			const url = this.props.info[0].orderLink;

			window.location.href = `${this.props.nemoURL}${url.replace('/', '')}`;
		}
	}

	renderAction(): React.ReactNode {
		return <>
			<Button onClick={this.changeFlight} color="default">
				{i18n('error-actualization-back')}
			</Button>

			{this.props.problem === ActualizationProblem.Price &&
				<Button onClick={this.goToBooking} color="primary">
					{i18n('error-actualization-continue')}
				</Button>
			}
		</>;
	}

	render(): React.ReactNode {
		return <DialogMessage
			visible={this.props.problem !== ActualizationProblem.NoError}
			header={this.renderHeader()}
			content={this.renderContent()}
			actions={this.renderAction()}
		/>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		problem: state.actualization.problem,
		info: state.actualization.info,
		nemoURL: getNemoURL(state)
	};
};

const mapDispatchToProps = {
	goToLeg,
	clearActualizationProblems
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler);
