import * as React from 'react';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

class Flight extends React.Component {
	render() {
		return <ExpansionPanel className="flight">
			<ExpansionPanelSummary className="flight-summary">
				<div className="flight-summary__left">
					<div className="flight-summary-logo">
						<img className="flight-summary-logo__image" src="https://sys.nemo.travel/guideStatic/images/carrier/logotype/5601-c9e32e06fc1c499a2f5e994f4273f680.svg"/>
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							<Typography variant="headline">08:00</Typography>
						</div>

						<div className="flight-summary-stage__location">
							<Typography variant="caption">DME</Typography>
						</div>
					</div>

					<div className="flight-summary-stage-routeInfo">
						<div className="flight-summary-stage-routeInfo__arrow"/>
						<span className="flight-summary-stage-routeInfo__flightTime">1 ч 30 мин</span>
					</div>

					<div className="flight-summary-stage">
						<div className="flight-summary-stage__time">
							<Typography variant="headline">10:30</Typography>
						</div>

						<div className="flight-summary-stage__location">
							<Typography variant="caption">RTW</Typography>
						</div>
					</div>
				</div>

				<div className="flight-summary__middle">
					<div className="flight-summary-transfers">
						прямой
					</div>

					<div className="flight-summary-route">
						Москва, Домодедово &mdash; Саратов
					</div>
				</div>

				<div className="flight-summary__right">
					<div className="flight-summary-price">
						<div className="flight-summary-price__amount">
							от <Typography className="flight-summary-price__amount-wrapper" variant="title">$110</Typography>
						</div>

						<div className="flight-summary-price__scope">
							туда и обратно
						</div>
					</div>

					<div className="flight-summary-buy">
						<Button variant="raised" color="secondary">Выбрать</Button>
					</div>
				</div>
			</ExpansionPanelSummary>

			<ExpansionPanelDetails className="flight-details">
				Информация
			</ExpansionPanelDetails>
		</ExpansionPanel>;
	}
}

export default Flight;
