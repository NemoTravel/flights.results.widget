import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleUsable } from '../../store/filters/usable/actions';
import { connect } from 'react-redux';
import { getIsUsable } from '../../store/filters/usable/selectors';
import { isFirstLeg } from '../../store/currentLeg/selectors';

interface StateProps {
	isUsable: boolean;
	isFirstLeg: boolean;
}

interface DispatchProps {
	toggleUsable: typeof toggleUsable;
}

type Props = StateProps & DispatchProps;

class Usable extends Filter<Props, FilterState> {
	protected type = FilterType.Usage;
	protected label = 'Удобные рейсы';

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.isUsable !== nextProps.isUsable ||
			this.props.isFirstLeg !== nextProps.isFirstLeg ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: props.isUsable
		} as FilterState);
	}

	onClick(): void {
		this.props.toggleUsable();
	}

	isVisible(): boolean {
		return !this.props.isFirstLeg;
	}

	onClear(): void {
		this.props.toggleUsable();
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isUsable: getIsUsable(state),
		isFirstLeg: isFirstLeg(state)
	};
};

const mapDispatchToProps = {
	toggleUsable
};

export default connect(mapStateToProps, mapDispatchToProps)(Usable);
