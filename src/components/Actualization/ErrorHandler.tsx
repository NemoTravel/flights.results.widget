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
import Price from '../Price';
import Flight from '../Flight';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Tooltip from '../Flight/Tooltip';

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
	tooltipClass = {
		tooltip: 'results-error-tooltip'
	};

	popperProps = {
		modifiers: {
			flip: {
				enabled: false
			},
			preventOverflow: {
				escapeWithReference: true
			}
		}
	};

	renderHeader(): React.ReactNode {
		return i18n(`error-actualization-${this.props.problem}_header`);
	}

	renderFlights(): React.ReactNode {
		return this.props.info.map((info, index) => {
			const className = 'results-error-flight ' + (!info.isAvailable ? 'results-error-flight__notAvailable' : 'results-error-flight__available'),
				title = i18n(info.isAvailable ? 'error-actualization-Availability_flight_available' : 'error-actualization-Availability_flight_notAvailable');

			return <Tooltip title={title} placement="top" key={index} classes={this.tooltipClass} PopperProps={this.popperProps}>
				<div className={className}>
					<div className="results-error-flight__icon">
						<div className="results-error-flight__iconContainer">
							{info.isAvailable ? <Check/> : <Close/>}
						</div>
					</div>

					<Flight
						flight={info.flight}
						nemoURL={this.props.nemoURL}
						key={index}
						isToggleable={false}
					/>
				</div>
			</Tooltip>;
		});
	}

	renderContent(): React.ReactNode {
		switch (this.props.problem) {
			case ActualizationProblem.Availability:
				return <>
					<div className="results-error-notAvailable">
						{this.renderFlights()}
					</div>

					{i18n(`error-actualization-${this.props.problem}`)}
				</>;

			case ActualizationProblem.Price:
				return <>
					<div className="results-error-priceChanged">
						<div className="results-error__price_old">
							<Price price={this.props.info[0].priceInfo.oldPrice}/>
						</div>
						<div className="results-error__price_new">
							<Price price={this.props.info[0].priceInfo.newPrice}/>
						</div>
					</div>

					{i18n(`error-actualization-${this.props.problem}`)}
				</>;

			default:
				return i18n(`error-actualization-${this.props.problem}`);
		}
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
					<Button className="dialog-actions__button" onClick={this.changeFlight} color="primary">
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
