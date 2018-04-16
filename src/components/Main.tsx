import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import { Component as SearchForm, SearchInfo } from '@nemo.travel/search-widget';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState, CommonThunkAction, Language } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import Toolbar from './Toolbar';
import { REQUEST_URL } from '../utils';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { startSearch } from '../store/actions';

interface StateProps {
	isLoading: boolean;
	isSelectionComplete: boolean;
}

interface DispatchProps {
	startSearch: (searchInfo: SearchInfo) => CommonThunkAction;
}

class Main extends React.Component<StateProps & DispatchProps> {
	render(): React.ReactNode {
		return (
			<div className={classNames('results', { results_isLoading: this.props.isLoading })}>
				<SearchForm nemoURL={REQUEST_URL} locale={Language.Russian} onSearch={this.props.startSearch}/>

				<div className="results__inner">
					<div className="results-loader">
						<CircularProgress color="secondary" variant="indeterminate"/>
					</div>

					{this.props.isSelectionComplete ? <AlternativeFlights/> : <Results/>}

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

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		startSearch: bindActionCreators(startSearch, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
