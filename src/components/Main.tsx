import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { RouterState } from 'connected-react-router';
import LinearProgress from '@material-ui/core/LinearProgress';

import Results from './Results';
import FareFamilies from './FareFamilies';
import { RootState } from '../store/reducers';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import SearchForm from './SearchForm';
import Snackbar from './Snackbar';
import { Language } from '../enums';
import { getLocale, getNemoURL } from '../store/config/selectors';
import DummyResults from './DummyResults';

interface StateProps {
	isLoading: boolean;
	locale: Language;
	nemoURL: string;
	isSelectionComplete: boolean;
}

type Props = Partial<RouterState> & StateProps;

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		const wrapperClassName = classNames('results', {
			results_isLoading: this.props.isLoading,
			results_pinned: this.props.isLoading || this.props.location.pathname !== '/'
		});

		return (
			<div className={wrapperClassName}>
				<SearchForm/>

				{this.props.isLoading && (
					<div className="results-loader">
						<LinearProgress className="results-loader__progressBar" color="secondary" variant="query"/>
						<DummyResults/>
					</div>
				)}

				<Route path="/results/:id(\d+/?)+" render={() => (
					this.props.isSelectionComplete ? <FareFamilies/> : (!this.props.isLoading && <Results/>)
				)}/>

				{Snackbar}
			</div>
		);
	}
}

const mapStateToProps = (state: RootState): Props => {
	return {
		locale: getLocale(state),
		nemoURL: getNemoURL(state),
		location: state.router.location,
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

export default connect(mapStateToProps)(Main);
