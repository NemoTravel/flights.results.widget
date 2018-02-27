import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import Toolbar from './Toolbar';

interface StateProps {
	isLoading: boolean;
	isSelectionComplete: boolean;
}

class Main extends React.Component<StateProps> {
	render(): React.ReactNode {
		return <div className={classNames('results', { results_isLoading: this.props.isLoading })}>
			<div className="results-loader">
				<CircularProgress color="secondary" variant="indeterminate"/>
			</div>

			{this.props.isSelectionComplete ? <AlternativeFlights/> : <Results/>}

			<Toolbar/>
		</div>;
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

export default connect(mapStateToProps)(Main);
