import * as React from 'react';
import FlightTakeOffIcon from 'material-ui-icons/FlightTakeoff';
import Price from './Price';

class Toolbar extends React.Component {
	render(): React.ReactNode {
		return <section className="toolbar">
			<div className="toolbar__inner">
				<div className="toolbar-legs">
					<div className="toolbar-legs-leg">
						<FlightTakeOffIcon className="toolbar-legs-leg__icon"/>
						Саратов &mdash; Москва, 24 июня
					</div>

					<div className="toolbar-legs-leg toolbar-legs-leg_disabled">
						<FlightTakeOffIcon className="toolbar-legs-leg__icon toolbar-legs-leg__icon_reverse"/>
						Москва &mdash; Санкт-Петербург, 25 июня
					</div>
				</div>

				<div className="toolbar-totalPrice">
					<Price price={{ amount: 1336, currency: 'RUB'}}/>
				</div>
			</div>
		</section>;
	}
}

export default Toolbar;
