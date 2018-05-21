import * as React from 'react';
import TooltipComponent, { TooltipProps } from 'material-ui/Tooltip';

class Tooltip extends React.Component<TooltipProps> {
	shouldComponentUpdate(): boolean {
		return false;
	}

	render(): React.ReactNode {
		return <TooltipComponent {...this.props}>
			{this.props.children}
		</TooltipComponent>;
	}
}

export default Tooltip;
