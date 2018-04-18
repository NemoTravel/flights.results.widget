import * as React from 'react';
import * as classnames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Component as SearchFormComponent, ComponentProps, SearchInfo } from '@nemo.travel/search-widget';

import { REQUEST_URL } from '../utils';
import { Language } from '../state';

type Props = RouteComponentProps<any> & ComponentProps;

class SearchForm extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.onSearch = this.onSearch.bind(this);
	}

	onSearch(searchInfo: SearchInfo): void {
		const { history, onSearch } = this.props;

		onSearch(searchInfo);
		history.push('/results');
	}

	render(): React.ReactNode {
		const isResultsPage = this.props.location.pathname === '/results';

		return <div className={classnames('results-searchForm', { 'results-searchForm_pinned': isResultsPage })}>
			<SearchFormComponent nemoURL={REQUEST_URL} locale={Language.Russian} onSearch={this.onSearch}/>
		</div>;
	}
}

export default withRouter(SearchForm);
