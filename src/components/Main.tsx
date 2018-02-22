import * as React from 'react';
import { connect } from 'react-redux';

import Results from './Results';
import AlternativeFlights from './AlternativeFlights';
import { ApplicationState } from '../state';
import { isSelectionComplete } from '../store/selectedFlights/selectors';

interface Props {
	isSelectionComplete: boolean;
}

class Main extends React.Component<Props> {
	render(): React.ReactNode {
		return this.props.isSelectionComplete ? <AlternativeFlights/> : <Results/>;
	}
}

const mapStateToProps = (state: ApplicationState): Props => {
	return {
		isSelectionComplete: isSelectionComplete(state)
	};
};

export default connect(mapStateToProps)(Main);
