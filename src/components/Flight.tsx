import * as React from 'react';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';

class Flight extends React.Component {
	render() {
		return <ExpansionPanel>
			<ExpansionPanelSummary>
				asd
			</ExpansionPanelSummary>

			<ExpansionPanelDetails>
				123
			</ExpansionPanelDetails>
		</ExpansionPanel>;
	}
}

export default Flight;
