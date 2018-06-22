import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';

import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleComfortable } from '../../store/filters/comfortable/actions';
import { getIsComfortable, isComfortableFilterEnabled } from '../../store/filters/comfortable/selectors';

interface StateProps {
	isActive: boolean;
	isEnabled: boolean;
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
			this.props.isEnabled !== nextProps.isEnabled ||
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
		return this.props.isEnabled;
	}

	onClear(): void {
		this.props.toggleComfortable();
	}

	render(): React.ReactNode {
		return this.isVisible() ? (
			<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
				<Tooltip title={<span className="tooltip">Рейсы той же авиакомпании с вылетом из того же аэропорта</span>} placement="top">
					<Chip className="filters-filter-chip" {...this.getChipProps()}/>
				</Tooltip>
			</div>
		) : null;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		isActive: getIsComfortable(state),
		isEnabled: isComfortableFilterEnabled(state)
	};
};

const mapDispatchToProps = {
	toggleComfortable
};

export default connect(mapStateToProps, mapDispatchToProps)(Comfortable);
