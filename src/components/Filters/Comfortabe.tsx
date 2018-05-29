import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleComfortable } from '../../store/filters/comfortable/actions';
import { connect } from 'react-redux';
import { getIsComfortable } from '../../store/filters/comfortable/selectors';
import { isFirstLeg } from '../../store/currentLeg/selectors';

interface StateProps {
	isActive: boolean;
	isFirstLeg: boolean;
}

interface DispatchProps {
	toggleComfortable: typeof toggleComfortable;
}

type Props = StateProps & DispatchProps;

class Comfortable extends Filter<Props, FilterState> {
	protected type = FilterType.Comfortable;
	protected label = 'Удобные рейсы';

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.isActive !== nextProps.isActive ||
			this.props.isFirstLeg !== nextProps.isFirstLeg ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentWillReceiveProps(props: Props): void {
		this.setState({
			isActive: props.isActive
		} as FilterState);
	}

	onClick(): void {
		this.props.toggleComfortable();
	}

	isVisible(): boolean {
		return !this.props.isFirstLeg;
	}

	onClear(): void {
		this.props.toggleComfortable();
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isActive: getIsComfortable(state),
		isFirstLeg: isFirstLeg(state)
	};
};

const mapDispatchToProps = {
	toggleComfortable
};

export default connect(mapStateToProps, mapDispatchToProps)(Comfortable);
