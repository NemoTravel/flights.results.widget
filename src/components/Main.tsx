import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import { Component as SearchForm } from '@nemo.travel/search-widget';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState, Language } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import Toolbar from './Toolbar';
import { REQUEST_URL } from '../utils';

interface StateProps {
	isLoading: boolean;
	isSelectionComplete: boolean;
}

class Main extends React.Component<StateProps> {
	render(): React.ReactNode {
		return (
			<div className={classNames('results', { results_isLoading: this.props.isLoading })}>
				<SearchForm nemoURL={REQUEST_URL} locale={Language.Russian}/>

				<div className="results__inner">
					<div className="results-loader">
						<CircularProgress color="secondary" variant="indeterminate"/>
					</div>

					{!this.props.isLoading ? (
						this.props.isSelectionComplete ? <AlternativeFlights/> : <Results/>
					) : null}

					<Toolbar/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

export default connect(mapStateToProps)(Main);
