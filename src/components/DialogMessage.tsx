import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface Props {
	header?: React.ReactNode;
	content?: React.ReactNode;
	actions?: React.ReactNode;
	visible: boolean;
}

class DialogMessage extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return (
			this.props.visible !== nextProps.visible ||
			this.props.header !== nextProps.header ||
			this.props.actions !== nextProps.actions ||
			this.props.content !== nextProps.content
		);
	}

	render(): React.ReactNode {
		return <Dialog className="dialog" open={this.props.visible} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
			{this.props.header && <DialogTitle className="dialog-title" id="alert-dialog-title">{this.props.header}</DialogTitle>}
			{this.props.content && <DialogContent className="dialog-content">{this.props.content}</DialogContent>}
			{this.props.actions && <DialogActions className="dialog-actions">{this.props.actions}</DialogActions>}
		</Dialog>;
	}
}

export default DialogMessage;
