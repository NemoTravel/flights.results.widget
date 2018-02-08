import * as React from 'react';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';

class Flight extends React.Component {
	render() {
		return <ExpansionPanel className="flight">
			<ExpansionPanelSummary className="flight-summary">
				<img className="flight-summary-logo" src="https://sys.nemo.travel/guideStatic/images/carrier/logotype/5601-c9e32e06fc1c499a2f5e994f4273f680.svg"/>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						<Typography variant="headline">08:00</Typography>
					</div>

					<div className="flight-summary-stage__location">Москва, Внуково</div>
				</div>

				<div className="flight-summary-stage-routeInfo">
					<span className="flight-summary-stage-routeInfo__transfers">Прямой рейс</span>
					<span className="flight-summary-stage-routeInfo__flightTime">1 ч 30 мин</span>
				</div>

				<div className="flight-summary-stage">
					<div className="flight-summary-stage__time">
						<Typography variant="headline">10:30</Typography>
					</div>

					<div className="flight-summary-stage__location">Саратов</div>
				</div>
			</ExpansionPanelSummary>

			<ExpansionPanelDetails>

			</ExpansionPanelDetails>
		</ExpansionPanel>;
	}
}

export default Flight;
