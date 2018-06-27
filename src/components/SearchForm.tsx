import * as React from 'react';
import * as classnames from 'classnames';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Component as SearchFormComponent, ComponentProps, SearchInfo } from '@nemo.travel/search-widget';

import { REQUEST_URL } from '../utils';
import { RouteType } from '../enums';

type Props = RouteComponentProps<any> & ComponentProps;

interface State {
	isFixed: boolean;
}

class SearchForm extends React.Component<Props, State> {
	state: State = {
		isFixed: false
	};

	protected searchForm: SearchFormComponent = null;
	protected searchFormWrapper: HTMLElement = null;
	protected resultsWidget: HTMLElement = null;

	constructor(props: Props) {
		super(props);

		this.onSearch = this.onSearch.bind(this);
		this.scrollEvent = this.scrollEvent.bind(this);
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

		this.resultsWidget = document.getElementById('searchResultsRoot');

		window.addEventListener('scroll', this.scrollEvent);
	}

	componentWillUnmount(): void {
		window.removeEventListener('scroll', this.scrollEvent);
	}

	scrollEvent(): void {
		const top = this.resultsWidget.getBoundingClientRect().top,
			width = this.resultsWidget.offsetWidth;

		if (top < 0) {
			if (!this.state.isFixed) {
				this.setState({
					isFixed: true
				});

				this.searchFormWrapper.style.width = String(width) + 'px';
			}
		}
		else if (this.state.isFixed) {
			this.setState({
				isFixed: false
			});
		}
	}

	render(): React.ReactNode {
		const isResultsPage = this.props.location.pathname !== '/',
			isCR = this.searchForm ? this.searchForm.getSeachInfo().routeType === RouteType.CR : false;

		return <div ref={wrapper => this.searchFormWrapper = wrapper} className={classnames('results-searchForm', { 'results-searchForm_pinned': isResultsPage }, { 'results-searchForm_fixed': this.state.isFixed && !isCR })}>
			<SearchFormComponent ref={component => this.searchForm = component} nemoURL={REQUEST_URL} locale={this.props.locale} onSearch={this.onSearch}/>
		</div>;
	}
}

export default withRouter(SearchForm);
