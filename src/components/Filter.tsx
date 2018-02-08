import * as React from 'react';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';

interface State {
	element?: HTMLElement;
	isOpen?: boolean;
}

abstract class Filter extends React.Component<any, State> {
	state: State = {
		isOpen: false,
		element: null
	};

	protected abstract label: string;

	constructor(props: any) {
		super(props);

		this.getElement = this.getElement.bind(this);
		this.openPopover = this.openPopover.bind(this);
		this.closePopover = this.closePopover.bind(this);
	}

	abstract renderPopover(): React.ReactNode;

	getElement(node: HTMLDivElement): void {
		this.setState({
			element: node
		} as State);
	}

	openPopover(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);
	}

	closePopover(): void {
		this.setState({
			isOpen: false
		} as State);
	}

	render(): React.ReactNode {
		return <div className="filters-filter" ref={this.getElement}>
			<Chip label={this.label} onClick={this.openPopover}/>

			<Popover
				className="filters-filter-popover"
				open={this.state.isOpen}
				onClose={this.closePopover}
				anchorReference="anchorEl"
				anchorEl={this.state.element}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
			>
				<div className="filters-filter-popover__inner">
					{this.renderPopover()}
				</div>
			</Popover>
		</div>;
	}
}

export default Filter;
