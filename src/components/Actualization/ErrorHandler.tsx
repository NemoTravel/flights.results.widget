import * as React from 'react';
import { ActualizationProblem } from '../../store/actualization/reducers';
import AvailabilityInfo from '../../schemas/AvailabilityInfo';
import { RootState } from '../../store/reducers';
import { goToLeg } from '../../store/currentLeg/actions';
import { connect } from 'react-redux';
import { i18n } from '../../i18n';
import Button from '@material-ui/core/Button';
import DialogMessage from '../DialogMessage';
import Price from '../Price';
import { getNemoURL } from '../../store/config/selectors';

const ERROR_AVAILABILITY = 'availability';
const ERROR_PRICE = 'priceChanged';
const ERROR_UNKNOWN = 'other';
const NO_ERROR = 'noError';

export interface StateProps {
	problem: ActualizationProblem;
	info: AvailabilityInfo[];
	nemoURL: string;
}

interface DispatchProps {
	goToLeg: typeof goToLeg;
}

interface State {
	typeError: string;
}

class ErrorHandler extends React.Component<StateProps & DispatchProps, State> {
	state: State = {
		typeError: NO_ERROR
	};

	constructor(props: StateProps & DispatchProps) {
		super(props);

		this.changeFlight = this.changeFlight.bind(this);
		this.goToBooking = this.goToBooking.bind(this);
	}

	componentWillReceiveProps({ problem, info }: StateProps): void {
		let typeError = '';

		if (problem === ActualizationProblem.Availability) {
			typeError = ERROR_AVAILABILITY;
		}
		else if (problem === ActualizationProblem.Price) {
			typeError = ERROR_PRICE;
		}
		else if (problem === ActualizationProblem.Unknown) {
			typeError = ERROR_UNKNOWN;
		}

		if (this.state.typeError !== typeError) {
			this.setState({ typeError });
		}
	}

	renderHeader(): React.ReactNode {
		return <>{i18n(`error-actualization-${this.state.typeError}_header`)}</>;
	}

	renderContent(): React.ReactNode {
		let contentText = i18n(`error-actualization-${this.state.typeError}`);

		if (this.state.typeError === ERROR_PRICE) {
			return <>
				{contentText}
				<Price price={this.props.info[this.props.info.length - 1].priceInfo.newPrice}/>
			</>;
		}
		else if (this.state.typeError === ERROR_AVAILABILITY) {
			const firstModifiedFlight = this.props.info[0].flight;

			contentText = contentText.replace('%-departure-%', firstModifiedFlight.firstSegment.depAirport.city.name)
				.replace('%-arrival-%', firstModifiedFlight.lastSegment.arrAirport.city.name)
				.replace('%-airline-%', firstModifiedFlight.validatingCarrier.name);
		}

		return <>{contentText}</>;
	}

	changeFlight(): void {
		this.setState({ typeError: NO_ERROR });
		this.props.goToLeg(0);
	}

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

			{this.state.typeError === ERROR_PRICE ?
				<Button onClick={this.goToBooking} color="primary">
					{i18n('error-actualization-continue')}
				</Button>
			: null}
		</>;
	}

	render(): React.ReactNode {
		return <DialogMessage
			visible={this.state.typeError !== NO_ERROR}
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
	goToLeg
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler);
