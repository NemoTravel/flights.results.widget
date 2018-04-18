import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import { SearchInfo } from '@nemo.travel/search-widget';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState, CommonThunkAction } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import Toolbar from './Toolbar';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { startSearch } from '../store/actions';
import SearchForm from './SearchForm';

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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		startSearch: bindActionCreators(startSearch, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
