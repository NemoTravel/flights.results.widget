import * as React from 'react';
import Leg from './Leg';
import * as classnames from 'classnames';
import BaggageIcon from '@material-ui/icons/Work';

class OptionsLeg extends Leg {
	render(): React.ReactNode {
		const { isDisabled, isSelected } = this.props;
		const classNames = classnames('toolbar-legs-leg', {
			'toolbar-legs-leg_disabled': isDisabled,
			'toolbar-legs-leg_selected': isSelected
		});

		return <div className={classNames}>
			<BaggageIcon className="toolbar-legs-leg__icon"/>
			Выбор багажа и опций
		</div>;
	}
}

export default OptionsLeg;
