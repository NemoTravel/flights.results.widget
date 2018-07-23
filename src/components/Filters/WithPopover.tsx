import * as React from 'react';
import * as classnames from 'classnames';
import Chip, { ChipProps } from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import Filter, { State as FilterState } from '../Filter';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { i18n } from '../../i18n';
import MediaQuery from 'react-responsive';
import { ScreenMaxSize } from '../../enums';

export interface State extends FilterState {
	element?: HTMLElement;
	isOpen?: boolean;
	isFullScreenOpen?: boolean;
}

function Transition(props: any) {
	return <Slide direction="up" {...props} />;
}

abstract class WithPopover<P, S> extends Filter<P, State | S> {
	state: State = {
		chipLabel: '',
		isActive: false,
		isOpen: false,
		isFullScreenOpen: false,
		element: null
	};

	constructor(props: any) {
		super(props);

		this.getElement = this.getElement.bind(this);
		this.openPopover = this.openPopover.bind(this);
		this.closePopover = this.closePopover.bind(this);
		this.fullScreenOpen = this.fullScreenOpen.bind(this);
	}

	abstract renderPopover(): React.ReactNode;

	onPopoverOpen(): void {}
	onPopoverClose(): void {}

	getElement(node: HTMLDivElement): void {
		this.setState({
			chipLabel: this.state.chipLabel,
			isActive: this.state.isActive,
			isOpen: this.state.isOpen,
			element: node
		} as State);
	}

	onClick(): void {
		this.openPopover();
	}

	fullScreenOpen(): void {
		this.setState({
			isFullScreenOpen: !this.state.isFullScreenOpen
		} as State);

		if (this.state.isFullScreenOpen) {
			this.onMobileClick();
		}
	}

	openPopover(): void {
		this.setState({
			isOpen: !this.state.isOpen
		} as State);

		this.onPopoverOpen();
	}

	closePopover(): void {
		this.setState({
			isOpen: false
		} as State);

		this.onPopoverClose();
	}

	mobileRender(): React.ReactNode {
		return <>
			<MenuItem className={classnames('filters-filter-menu', { 'filters-filter-menu_active': this.state.isActive || this.state.isOpen })} onClick={this.fullScreenOpen}>{this.state.chipLabel}</MenuItem>

			<Dialog open={this.state.isFullScreenOpen} onClose={() => {}} fullScreen={true} TransitionComponent={Transition}>
				<AppBar position="static">
					<Toolbar>
						<IconButton color="inherit" onClick={this.fullScreenOpen} aria-label="Close">
							<CloseIcon/>
						</IconButton>

						<Typography variant="title" color="inherit">
							{i18n(`filters-${this.type}-title`)}
						</Typography>
					</Toolbar>
				</AppBar>

				<div className={`filters-filter-popover__wrapper filters-filter-popover__wrapper_${this.type}`}>
					{this.renderPopover()}
				</div>
			</Dialog>
		</>;
	}

	render(): React.ReactNode {
		const chipProps: ChipProps = {
			label: this.state.chipLabel,
			onClick: this.onClick
		};

		if (this.state.isActive) {
			chipProps.onDelete = this.onClear;
		}

		return this.isVisible() ? <>
			<MediaQuery minDeviceWidth={ScreenMaxSize.Tablet}>
				<div className={classnames('filters-filter', { 'filters-filter_active': this.state.isActive || this.state.isOpen })} ref={this.getElement}>
					<Chip className="filters-filter-chip" {...chipProps}/>

					<Popover
						className={`filters-filter-popover filters-filter-popover_${this.type}`}
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
						<div className={`filters-filter-popover__wrapper filters-filter-popover__wrapper_${this.type}`}>
							{this.renderPopover()}
						</div>
					</Popover>
				</div>
			</MediaQuery>

			<MediaQuery maxDeviceWidth={ScreenMaxSize.Tablet}>
				{this.mobileRender()}
			</MediaQuery>
		</> : null;
	}
}

export default WithPopover;
