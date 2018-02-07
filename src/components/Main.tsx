import * as React from 'react';
import Chip from 'material-ui/Chip';

class Main extends React.Component {
	render() {
		return <div className="results-wrapper">
			<section className="scenarios">

			</section>

			<section className="filters">
				<div className="filters-filter">
					<Chip label="Авиакомпании" onClick={() => {}}/>
				</div>
				<div className="filters-filter">
					<Chip label="Аэропорты" onClick={() => {}}/>
				</div>
				<div className="filters-filter">
					<Chip label="Время" onClick={() => {}}/>
				</div>
			</section>

			<section className="results">

			</section>
		</div>;
	}
}

export default Main;
