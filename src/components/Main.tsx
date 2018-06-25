import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { HashRouter as Router, Route } from 'react-router-dom';

import Results from './Results';
import FareFamilies from './FareFamilies';
import { RootState } from '../store/reducers';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import {  startSearch } from '../store/actions';
import SearchForm from './SearchForm';
import Snackbar from './Snackbar';
import { Language } from '../enums';

interface StateProps {
	isLoading: boolean;
	locale: Language;
	isSelectionComplete: boolean;
}

interface DispatchProps {
	startSearch: typeof startSearch;
}

class Main extends React.Component<StateProps & DispatchProps> {
	render(): React.ReactNode {
		const wrapperClassName = classNames('results', { results_isLoading: this.props.isLoading });

		return (
			<Router>
				<div className={wrapperClassName}>
					<SearchForm onSearch={this.props.startSearch} locale={this.props.locale}/>

					<Route path="/results" render={() => (
						<>
							{this.props.isSelectionComplete ? <FareFamilies/> : <Results/>}
						</>
					)}/>

					{Snackbar}
				</div>
			</Router>
		);
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		locale: state.config.locale,
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

const mapDispatchToProps = {
	startSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
