import * as React from 'react';
import * as classnames from 'classnames';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';

import Filter, { Type as FilterType, State as FilterState } from '../Filter';
import { RootState } from '../../store/reducers';
import { toggleComfortable } from '../../store/filters/comfortable/actions';
import { getIsComfortable, isComfortableFilterEnabled } from '../../store/filters/comfortable/selectors';
import { i18n } from '../../i18n';
import MediaQuery from 'react-responsive';
import { ScreenMaxSize } from '../../enums';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

interface OwnProps {
	handleMobileClick?: () => void;
}

interface StateProps {
	isActive: boolean;
	isEnabled: boolean;
}

interface DispatchProps {
	toggleComfortable: typeof toggleComfortable;
}

type Props = StateProps & DispatchProps & OwnProps;

class Comfortable extends Filter<Props, FilterState> {
	protected type = FilterType.Comfortable;
	protected label = i18n('filters-comfortable-title');

	shouldComponentUpdate(nextProps: Props, nextState: FilterState): boolean {
		return this.props.isActive !== nextProps.isActive ||
			this.props.isEnabled !== nextProps.isEnabled ||
			this.state.isActive !== nextState.isActive ||
			this.state.chipLabel !== nextState.chipLabel;
	}

	componentDidMount(): void {
		this.setState({
			isActive: this.props.isActive,
			chipLabel: this.label
		});
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

	onMobileClick(): void {
		this.onClick();
		this.props.handleMobileClick();
	}

	render(): React.ReactNode {
		return this.isVisible() ? (
			<>
				<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
					<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive })}>
						<Tooltip title={<span className="tooltip">{i18n('filters-comfortable-tooltip')}</span>} placement="top">
							<Chip className="filters-filter-chip" {...this.getChipProps()}/>
						</Tooltip>
					</div>
				</MediaQuery>

				<MediaQuery maxDeviceWidth={ScreenMaxSize.Tablet}>
					<MenuItem className={classnames('filters-filter-menu', { 'filters-filter-menu_active': this.state.isActive })} onClick={this.onMobileClick}>
						<div className="filters-filter-menu__item">
							{this.state.chipLabel}
						</div>
					</MenuItem>
				</MediaQuery>
			</>
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
