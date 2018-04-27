import * as React from 'react';
import { connect } from 'react-redux';
import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { ApplicationState } from '../../state';
import { toggleDirectFlights } from '../../store/filters/directOnly/actions';
import { getIsDirectOnly } from '../../store/filters/directOnly/selectors';
import { hasAnyTransferFlights } from '../../store/selectors';

interface StateProps {
	directOnly: boolean;
	hasAnyTransferFlights: boolean;
}

interface DispatchProps {
	toggleDirectFlights: () => Action;
}

type Props = StateProps & DispatchProps;

class DirectOnly extends Filter<Props, FilterState> {
	protected type = FilterType.DirectOnly;
	protected label = 'Без пересадок';

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.directOnly !== nextProps.directOnly ||
			this.state.isActive !== nextState.isActive ||
			this.props.hasAnyTransferFlights !== nextProps.hasAnyTransferFlights ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: props.directOnly
		} as FilterState);
	}

	onClick(): void {
		this.props.toggleDirectFlights();
	}

	onClear(): void {
		this.props.toggleDirectFlights();
	}

	isVisible(): boolean {
		return this.props.hasAnyTransferFlights;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		directOnly: getIsDirectOnly(state),
		hasAnyTransferFlights: hasAnyTransferFlights(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<Action, any>): DispatchProps => {
	return {
		toggleDirectFlights: bindActionCreators(toggleDirectFlights, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectOnly);
