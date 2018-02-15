import * as React from 'react';
import { connect } from 'react-redux';
import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { Action, bindActionCreators, Dispatch } from 'redux';
import { toggleDirectFlights } from '../../store/filters/actions';
import { ApplicationState } from '../../state';

interface StateProps {
	directOnly: boolean;
}

interface DispatchProps {
	toggleDirectFlights: () => Action;
}

type Props = StateProps & DispatchProps;

class DirectOnly extends Filter<Props, FilterState> {
	protected type = FilterType.DirectOnly;
	protected label = 'Без пересадок';

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
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		directOnly: state.filters.directOnly
	};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
	return {
		toggleDirectFlights: bindActionCreators(toggleDirectFlights, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectOnly);
