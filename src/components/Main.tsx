import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

import Results from './Results';
import FareFamilies from './FareFamilies';
import { RootState } from '../store/reducers';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import { startSearch } from '../store/actions';
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

type Props = RouteComponentProps<any> & StateProps;

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		const wrapperClassName = classNames('results', { results_isLoading: this.props.isLoading, results_pinned: this.props.location.pathname !== '/' });

		return (
			<div className={wrapperClassName}>
				<SearchForm/>

				{this.props.isLoading ? (
					<div className="results-loader">
						<LinearProgress className="results-loader__progressBar" color="secondary" variant="query"/>
						<DummyResults/>
					</div>
				) : null}

				<Route path="/results/:id(\d+/?)+" render={() => (
					<>
						{this.props.isSelectionComplete ? <FareFamilies/> : <Results/>}
					</>
				)}/>

				{Snackbar}
			</div>
		);
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		locale: getLocale(state),
		nemoURL: getNemoURL(state),
		isLoading: state.isLoading,
		isSelectionComplete: isSelectionComplete(state)
	};
};

export default connect(mapStateToProps)(withRouter(Main));
