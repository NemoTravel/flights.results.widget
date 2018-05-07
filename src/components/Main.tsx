import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import { SearchInfo } from '@nemo.travel/search-widget';
import { HashRouter as Router, Route } from 'react-router-dom';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState, CommonThunkAction } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import Toolbar from './Toolbar';
import { startSearch } from '../store/actions';
import SearchForm from './SearchForm';
import Snackbar from './Snackbar';

interface StateProps {
	isLoading: boolean;
	isSelectionComplete: boolean;
}

interface DispatchProps {
	startSearch: (searchInfo: SearchInfo) => CommonThunkAction;
}

class Main extends React.Component<StateProps & DispatchProps> {
	render(): React.ReactNode {
		const wrapperClassName = classNames('results', { results_isLoading: this.props.isLoading });

		return (
			<Router>
				<div className={wrapperClassName}>
					<SearchForm onSearch={this.props.startSearch}/>

					<Route path="/results" render={() => (
						<div className="results__inner">
							<div className="results-loader">
								<CircularProgress color="secondary" variant="indeterminate"/>
							</div>

							{this.props.isSelectionComplete ? <AlternativeFlights/> : <Results/>}

							<Toolbar/>
						</div>
					)}/>

					{Snackbar}
				</div>
			</Router>
		);
	}
}

const mapStateToProps = (state: ApplicationState): StateProps => {
	return {
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

const mapDispatchToProps = {
	startSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
