import * as React from 'react';
import * as classnames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Component as SearchFormComponent, ComponentProps, SearchInfo } from '@nemo.travel/search-widget';

type Props = RouteComponentProps<any> & ComponentProps;

class SearchForm extends React.Component<Props> {
	protected searchForm: SearchFormComponent = null;

	constructor(props: Props) {
		super(props);

		this.onSearch = this.onSearch.bind(this);
	}

	onSearch(searchInfo: SearchInfo): void {
		const { history, onSearch } = this.props;

		onSearch(searchInfo);
		history.replace('/results');
	}

	componentDidMount(): void {
		if (this.props.location.pathname === '/results') {
			this.props.onSearch(this.searchForm.getSeachInfo());
		}
	}

	render(): React.ReactNode {
		const isResultsPage = this.props.location.pathname !== '/';

		return <div className={classnames('results-searchForm', { 'results-searchForm_pinned': isResultsPage })}>
			<SearchFormComponent ref={component => this.searchForm = component} nemoURL={this.props.nemoURL} locale={this.props.locale} onSearch={this.onSearch}/>
		</div>;
	}
}

export default withRouter(SearchForm);
