import * as React from 'react';
import Flight from './Dummy/Flight';
import { i18n } from '../i18n';
import Typography from '@material-ui/core/Typography';

const DUMMY_FLIGHTS_COUNT = 8;

class DummyResults extends React.Component {
	renderHeader(): React.ReactNode {
		return <section className="filters">
			<div className="filters__left">
				<Typography variant="headline">{i18n('results-searchInProgressTitle')}</Typography>
			</div>

			<div className="filters__right">
				<div className="results-dummy__filter"><span className="results-dummy__text">∎∎∎∎∎∎∎∎</span></div>
				<div className="results-dummy__filter"><span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎</span></div>
				<div className="results-dummy__filter"><span className="results-dummy__text">∎∎∎∎∎∎∎∎∎∎∎∎</span></div>
			</div>
		</section>;
	}

	renderDummyFlights(): React.ReactNode {
		const array = new Array(DUMMY_FLIGHTS_COUNT);

		array.fill(1);

		return array.map((item, index) => {
			return <Flight key={index}/>;
		});
	}

	render(): React.ReactNode {
		return <div className="results__inner results-dummy">

			{this.renderHeader()}

			{this.renderDummyFlights()}
		</div>;
	}
}

export default DummyResults;
