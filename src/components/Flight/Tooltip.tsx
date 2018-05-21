import * as React from 'react';
import TooltipComponent, { TooltipProps } from 'material-ui/Tooltip';

class Tooltip extends React.Component<TooltipProps> {
	shouldComponentUpdate(nextProps: TooltipProps): boolean {
		return this.props.children !== nextProps.children;
	}

	render(): React.ReactNode {
		return <TooltipComponent className="test" {...this.props}>
			{this.props.children}
		</TooltipComponent>;
	}
}

export default Tooltip;
