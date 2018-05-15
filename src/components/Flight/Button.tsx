import * as React from 'react';
import UIButton from 'material-ui/Button';
import { OnClickHandler } from '../../schemas/OnClickHandler';

interface Props {
	className?: string;
	onClick?: OnClickHandler;
}

class Button extends React.Component<Props> {
	shouldComponentUpdate(): boolean {
		return false;
	}

	render(): React.ReactNode {
		return <UIButton variant="raised" color="secondary" {...this.props}>Выбрать</UIButton>;
	}
}

export default Button;
