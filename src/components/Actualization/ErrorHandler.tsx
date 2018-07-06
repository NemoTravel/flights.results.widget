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
		return i18n(`error-actualization-${this.props.problem}_header`);
	}

	renderContent(): React.ReactNode {
		return i18n(`error-actualization-${this.props.problem}`);
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
		switch (this.props.problem) {
			case ActualizationProblem.Availability:
				return (
					<Button className="dialog-actions__button" onClick={this.changeFlight} color="primary">
						{i18n('error-actualization-Availability-action_reselect')}
					</Button>
				);

			case ActualizationProblem.Price:
				return <>
					<Button className="dialog-actions__button" onClick={this.changeFlight} color="default">
						{i18n('error-actualization-Price-action_reselect')}
					</Button>

					<Button className="dialog-actions__button" onClick={this.goToBooking} color="primary" variant="outlined">
						{i18n('error-actualization-Price-action_continue')}
					</Button>
				</>;

			default:
				return (
					<Button className="dialog-actions__button" onClick={this.goToBooking} color="primary">
						{i18n('error-actualization-Unknown-action_OK')}
					</Button>
				);
		}
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
