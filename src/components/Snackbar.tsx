import * as React from 'react';
import SnackbarComponent from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

interface State {
	snackbarIsVisible: boolean;
	snackbarLabel: string;
}

const snackbarAutohideTime = 5000;

class Snackbar extends React.Component<any, State> {
	state: State = {
		snackbarIsVisible: false,
		snackbarLabel: ''
	};

	constructor(props: any) {
		super(props);

		this.showSnackbar = this.showSnackbar.bind(this);
		this.onSnackbarClose = this.onSnackbarClose.bind(this);
	}

	shouldComponentUpdate(nextProps: any, nextState: State): boolean {
		return this.state.snackbarLabel !== nextState.snackbarLabel || this.state.snackbarIsVisible !== nextState.snackbarIsVisible;
	}

	showSnackbar(label: string): void {
		this.setState({
			snackbarIsVisible: true,
			snackbarLabel: label
		});
	}

	onSnackbarClose(): void {
		this.setState({
			snackbarIsVisible: false
		});
	}

	render(): React.ReactNode {
		return <SnackbarComponent
			className="snackbar"
			open={this.state.snackbarIsVisible}
			autoHideDuration={snackbarAutohideTime}
			onClose={this.onSnackbarClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			ContentProps={{
				'aria-describedby': 'message-id'
			}}
			message={<span id="message-id">{this.state.snackbarLabel}</span>}
			action={[
				<IconButton
					className="snackbar-close"
					key="close"
					aria-label="Close"
					color="inherit"
					onClick={this.onSnackbarClose}
				>
					<CloseIcon />
				</IconButton>
			]}
		/>;
	}
}

let snackbarRef: Snackbar = null;
const snackbarInstance = <Snackbar ref={ref => snackbarRef = ref}/>;

export interface SnackbarProps {
	showSnackbar: (label: string) => void;
}

export function withSnackbar<P>(Component: React.ComponentType<P>): React.ComponentType<P> {
	return (props: any) => {
		return <Component {...props} showSnackbar={snackbarRef.showSnackbar}/>;
	};
}

export default snackbarInstance;
