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
		return this.props.visible !== nextProps.visible ||
			this.props.header !== nextProps.header ||
			this.props.actions !== nextProps.actions ||
			this.props.content !== nextProps.content;
	}

	render(): React.ReactNode {
		return <Dialog open={this.props.visible} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">

			{this.props.header ? <DialogTitle id="alert-dialog-title">{this.props.header}</DialogTitle> : null}

			{this.props.content ? <DialogContent>{this.props.content}</DialogContent> : null}

			{this.props.actions ? <DialogActions>{this.props.actions}</DialogActions> : null}
		</Dialog>;
	}
}

export default DialogMessage;
