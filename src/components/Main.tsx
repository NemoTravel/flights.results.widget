import * as React from 'react';
import * as classNames from 'classnames';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';

import Results from './Results';
import FareFamilies from './FareFamilies';
import { RootState } from '../store/reducers';
import { isSelectionComplete } from '../store/selectedFlights/selectors';
import { startSearch } from '../store/actions';
import SearchForm from './SearchForm';
import Snackbar from './Snackbar';
import { Language } from '../enums';
import { getLocale, getNemoURL } from '../store/config/selectors';
import DialogMessage from './DialogMessage';

interface StateProps {
	isLoading: boolean;
	locale: Language;
	nemoURL: string;
	isSelectionComplete: boolean;
}

interface DispatchProps {
	startSearch: typeof startSearch;
}

type Props = RouteComponentProps<any> & StateProps & DispatchProps;

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		const wrapperClassName = classNames('results', { results_isLoading: this.props.isLoading, results_pinned: this.props.location.pathname !== '/' });

		return (
			<div className={wrapperClassName}>
				<SearchForm onSearch={this.props.startSearch} nemoURL={this.props.nemoURL} locale={this.props.locale}/>

				<Route path="/results" render={() => (
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

const mapDispatchToProps = {
	startSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main));
