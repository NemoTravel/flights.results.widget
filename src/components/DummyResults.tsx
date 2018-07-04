import * as React from 'react';
import Flight from './Dummy/Flight';
import { i18n } from '../i18n';
import Typography from '@material-ui/core/Typography';

const DUMMY_FLIGHTS_COUNT = 15;
const flightsArray: React.ReactNode[] = [];

for (let i = 0; i < DUMMY_FLIGHTS_COUNT; i++) {
	flightsArray.push(<Flight key={i}/>);
}

class DummyResults extends React.Component {
	shouldComponentUpdate(): boolean {
		return false;
	}

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

	render(): React.ReactNode {
		return <div className="results__inner results-dummy">
			{this.renderHeader()}
			{flightsArray}
		</div>;
	}
}

export default DummyResults;
