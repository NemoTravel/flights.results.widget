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

const ERROR_AVABILITY = 'avability';
const ERROR_PRICE = 'priceChanged';
const NO_ERROR = 'noError';

export interface StateProps {
	problem: ActualizationProblem;
	info: AvailabilityInfo[];
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

	componentWillReceiveProps({ problem, info }: StateProps): void {
		let typeError = '';

		if (problem === ActualizationProblem.Availability) {
			typeError = ERROR_AVABILITY;
		}
		else if (problem === ActualizationProblem.Price) {
			typeError = ERROR_PRICE;
		}

		this.setState({ typeError });
	}

	renderHeader(): React.ReactNode {
		return <>{i18n(`error-actualization-${this.state.typeError}_header`)}</>;
	}

	renderContent(): React.ReactNode {
		const contentText = i18n(`error-actualization-${this.state.typeError}`);

		if (this.state.typeError === ERROR_PRICE) {
			return <>{contentText}
				<Price price={this.props.info[this.props.info.length - 1].priceInfo.newPrice}/>
			</>;
		}

		return <>{i18n(`error-actualization-${this.state.typeError}`)}</>;
	}

	renderAction(): React.ReactNode {
		if (this.state.typeError === ERROR_PRICE) {
			return <>
				<Button onClick={() => { this.setState({ typeError: NO_ERROR }); this.props.goToLeg(0); }} color="default">
					Выбрать другой перелет
				</Button>
				<Button onClick={() => { }} color="primary">
					Продолжить
				</Button>
			</>;
		}
		else {
			return <>
				<Button onClick={() => { this.setState({ typeError: NO_ERROR }); this.props.goToLeg(0); }} color="default">
					Выбрать другой перелет
				</Button>
			</>;
		}
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
		info: state.actualization.info
	};
};

const mapDispatchToProps = {
	goToLeg
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler);
