import * as React from 'react';
import Chip from 'material-ui/Chip';
import Tooltip from 'material-ui/Tooltip';
import * as classnames from 'classnames';

interface Props {
	label: string,
	isActive: boolean,
	onClick: React.EventHandler<any>,
	onDelete: React.EventHandler<any>
}

export class QuickFilter extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.label !== nextProps.label || this.props.isActive !== nextProps.isActive;
	}

	render(): React.ReactNode {
		const { label, isActive, onClick, onDelete } = this.props;

		return <Tooltip title={!isActive ? 'Добавить в фильтры' : ''} placement="top">
			<div className={classnames('flight-details-filter', {'flight-details-filter_active': isActive})}>
				<Chip
					className="flight-details-filter-chip"
					onDelete={isActive ? onDelete: null}
					label={label}
					onClick={!isActive ? onClick : null}
				/>
			</div>
		</Tooltip>;
	}
}
