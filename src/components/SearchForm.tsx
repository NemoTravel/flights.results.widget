import * as React from 'react';
import * as classnames from 'classnames';
import autobind from 'autobind-decorator';
import { RouterState } from 'connected-react-router';
import { Component as SearchFormComponent, ComponentProps } from '@nemo.travel/search-widget';
import { connect } from 'react-redux';

import { RootState } from '../store/reducers';
import { getLocale, getNemoURL } from '../store/config/selectors';
import { startSearch } from '../store/actions';
import { loadSearchResults } from '../store/results/actions';
import { i18n } from '../i18n';

type StateProps = ComponentProps & Partial<RouterState>;

interface DispatchProps {
	startSearch: typeof startSearch;
	loadSearchResults: typeof loadSearchResults;
}

type Props = StateProps & DispatchProps;

interface State {
	openedOnMobile: boolean;
}

class SearchForm extends React.Component<Props, State> {
	state: State = {
		openedOnMobile: false
	};

	protected searchForm: SearchFormComponent = null;
	protected searchFormWrapper: HTMLElement = null;

	@autobind
	getSearchFormRef(component: SearchFormComponent): void {
		this.searchForm = component;
	}

	@autobind
	getSearchFormWrapperRef(ref: HTMLElement): void {
		this.searchFormWrapper = ref;
	}

	componentWillMount(): void {
		window.addEventListener('click', this.handleOutsideClick);
	}

	componentWillUnmount(): void {
		window.removeEventListener('click', this.handleOutsideClick);
	}

	@autobind
	handleOutsideClick(): void {
		this.setState({ openedOnMobile: false });
	}

	@autobind
	shortOpen(): void {
		this.setState({ openedOnMobile: true });
	}

	wrapperClick(event: React.MouseEvent<HTMLElement>): void {
		event.stopPropagation();
	}

	componentDidMount(): void {
		if (/\/results\/(\d+\/?)+/.test(this.props.location.pathname)) {
			this.props.loadSearchResults(this.props.location.pathname);
		}
		else if (this.props.location.pathname === '/results') {
			this.props.startSearch(this.searchForm.getSeachInfo());
		}
	}

	render(): React.ReactNode {
		const isResultsPage = this.props.location.pathname !== '/';
		const classNames = classnames('results-searchForm', { 'results-searchForm_pinned': isResultsPage });
		const wrapperClassNames = classnames('results-searchForm__wrapper', { 'results-searchForm__wrapper_opened': this.state.openedOnMobile });

		return <div className={classNames}>
			<div className={wrapperClassNames} ref={this.getSearchFormWrapperRef} onClick={this.wrapperClick}>
				<SearchFormComponent
					ref={this.getSearchFormRef}
					nemoURL={this.props.nemoURL}
					locale={this.props.locale}
					onSearch={this.props.startSearch}
				/>

				<div className="results-searchForm-short" onClick={this.shortOpen}>
					<div className="results-searchForm-short__button">{i18n('results-searchForm-change')}</div>
				</div>
			</div>
		</div>;
	}
}

const mapStateToProps = (state: RootState): StateProps => {
	return {
		location: state.router.location,
		locale: getLocale(state),
		nemoURL: getNemoURL(state)
	};
};

const mapDispatchToProps = {
	startSearch,
	loadSearchResults
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
