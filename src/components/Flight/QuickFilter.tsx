import * as React from 'react';
import * as classnames from 'classnames';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { OnClickHandler } from '../../schemas/OnClickHandler';
import { i18n } from '../../i18n';

interface Props {
	label: string,
	isActive: boolean,
	isEnabled: boolean,
	onClick: OnClickHandler,
	onDelete: OnClickHandler
}

export class QuickFilter extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.label !== nextProps.label || this.props.isActive !== nextProps.isActive;
	}

	render(): React.ReactNode {
		const { label, isActive, onClick, onDelete, isEnabled } = this.props;

		return <Tooltip title={!isActive && onClick ? <span className="tooltip">{i18n('filters-add-tooltip')}</span> : ''} placement="top">
			<div className={classnames('flight-details-filter', {'flight-details-filter_active': isActive})}>
				<Chip
					className={classnames('flight-details-filter-chip', {'flight-details-filter-chip_disabled': !isEnabled})}
					onDelete={isActive ? onDelete: null}
					label={label}
					onClick={!isActive ? onClick : null}
				/>
			</div>
		</Tooltip>;
	}
}
