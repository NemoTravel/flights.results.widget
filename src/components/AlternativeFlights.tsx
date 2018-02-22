import * as React from 'react';
import { connect } from 'react-redux';
import { CommonThunkAction } from '../state';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { searchForAlternativeFlights } from '../store/actions';

interface DispatchProps {
	searchForAlternativeFlights: () => CommonThunkAction;
}

class AlternativeFlights extends React.Component<DispatchProps> {
	componentDidMount(): void {
		this.props.searchForAlternativeFlights();
	}

	render(): React.ReactNode {
		return null;
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
	return {
		searchForAlternativeFlights: bindActionCreators(searchForAlternativeFlights, dispatch)
	};
};

export default connect(null, mapDispatchToProps)(AlternativeFlights);
