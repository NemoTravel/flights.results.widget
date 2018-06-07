import * as React from 'react';
import UIButton from '@material-ui/core/Button';
import { OnClickHandler } from '../../schemas/OnClickHandler';

interface Props {
	className?: string;
	onClick?: OnClickHandler;
	children: React.ReactNode;
}

class Button extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return nextProps.children !== this.props.children;
	}

	render(): React.ReactNode {
		const { children, ...restProps } = this.props;

		return <UIButton variant="raised" color="secondary" {...restProps}>{children}</UIButton>;
	}
}

export default Button;
