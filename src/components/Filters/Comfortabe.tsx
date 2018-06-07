import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';

import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleComfortable } from '../../store/filters/comfortable/actions';
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

	render(): React.ReactNode {
		const chipProps: ChipProps = {
			label: this.state.chipLabel
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}
		else {
			chipProps.onClick = this.onClick;
		}

		return this.isVisible() ? (
			<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
				<Tooltip title="Рейсы той же авиакомпании с вылетом из того же аэропорта" placement="top">
					<Chip className="filters-filter-chip" {...chipProps}/>
				</Tooltip>
			</div>
		) : null;
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
