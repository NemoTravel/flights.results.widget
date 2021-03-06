import * as React from 'react';
import { connect } from 'react-redux';
import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleDirectFlights } from '../../store/filters/directOnly/actions';
import { getIsDirectOnly } from '../../store/filters/directOnly/selectors';
import { hasAnyTransferFlights } from '../../store/filters/directOnly/selectors';
import { i18n } from '../../i18n';

interface OwnProps {
	handleMobileClick?: () => void;
}

interface StateProps {
	directOnly: boolean;
	hasAnyTransferFlights: boolean;
}

interface DispatchProps {
	toggleDirectFlights: typeof toggleDirectFlights;
}

type Props = StateProps & DispatchProps & OwnProps;

class DirectOnly extends Filter<Props, FilterState> {
	protected type = FilterType.DirectOnly;
	protected label = i18n('filters-directOnly-title');

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.directOnly !== nextProps.directOnly ||
			this.state.isActive !== nextState.isActive ||
			this.props.hasAnyTransferFlights !== nextProps.hasAnyTransferFlights ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentDidMount(): void {
		this.setState({
			isActive: this.props.directOnly,
			chipLabel: this.label
		} as FilterState);
	}

	componentWillReceiveProps({ directOnly }: Props): void {
		this.updateState(directOnly);
	}

	updateState(directOnly: boolean): void {
		this.setState({
			isActive: directOnly
		} as FilterState);
	}

	onClick(): void {
		this.props.toggleDirectFlights();
	}

	onMobileClick(): void {
		this.onClick();
		this.props.handleMobileClick();
	}

	onClear(): void {
		this.props.toggleDirectFlights();
	}

	isVisible(): boolean {
		return this.props.hasAnyTransferFlights;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		directOnly: getIsDirectOnly(state),
		hasAnyTransferFlights: hasAnyTransferFlights(state)
	};
};

const mapDispatchToProps = {
	toggleDirectFlights
};

export default connect(mapStateToProps, mapDispatchToProps)(DirectOnly);
