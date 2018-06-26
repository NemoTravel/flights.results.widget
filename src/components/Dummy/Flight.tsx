import * as React from 'react';

class Flight extends React.Component {
	render(): React.ReactNode {
		return <div className="flight">
			<div className="flight-summary">
				<div className="flight-summary__left">
					<div className="flight-summary-expand">
						<svg fill="rgba(0, 0, 0, 0.54)" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
							<path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
							<path d="M0-.75h24v24H0z" fill="none"/>
						</svg>
					</div>

					<div className="flight-summary-logo">
						<div className="results-dummy__logo"></div>
					</div>

					<div className="flight-summary-stage flight-summary-stage_departure">
						<div className="flight-summary-stage__time">
							<span className="results-dummy__text">∎∎∎∎</span>
						</div>

						<div className="flight-summary-stage__date">
							<span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎∎∎</span>
						</div>
					</div>

					<div className="flight-summary-stage-routeInfo">
						<div className="flight-summary-stage-routeInfo__arrow"/>
						<span className="flight-summary-stage-routeInfo__flightTime">
							<span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎</span>
						</span>
					</div>

					<div className="flight-summary-stage flight-summary-stage_arrival">
						<div className="flight-summary-stage__time">
							<span className="results-dummy__text">∎∎∎∎</span>
						</div>

						<div className="flight-summary-stage__date">
							<span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎∎∎</span>
						</div>
					</div>
				</div>

				<div className="flight-summary__middle">
					<div className="flight-summary-transfers">
						<span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎</span>
					</div>

					<div className="flight-summary-route">
						<span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎</span>
					</div>
				</div>

				<div className="flight-summary__right">
					<div className="flight-summary-price">
						<div className="flight-summary-price__amount">
							<span className="price">
								<span className="price-amount"><span className="results-dummy__text">∎∎∎∎∎∎</span></span>
							</span>
						</div>
					</div>

					<div className="results-dummy__buy"><span className="results-dummy__text">∎∎∎∎∎∎∎∎</span></div>
				</div>
			</div>
		</div>;
	}
}

export default Flight;
