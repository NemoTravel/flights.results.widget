import * as React from 'react';
import * as classnames from 'classnames';
import autobind from 'autobind-decorator';
import Button from '@material-ui/core/Button/Button';

import Segment from './Segment';
import FlightModel from '../../models/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectedFamiliesState } from '../../store/fareFamilies/selectedFamilies/reducers';
import { selectFamily } from '../../store/fareFamilies/selectedFamilies/actions';
import { goToLeg } from '../../store/currentLeg/actions';
import Money from '../../schemas/Money';
import Flight from '../Flight';

interface Props {
	flight: FlightModel;
	prices: { [segmentId: number]: { [familyId: string]: Money } };
	selectedFamilies: SelectedFamiliesState;
	combinations: FareFamiliesCombinations;
	selectFamily: typeof selectFamily;
	goToLeg: typeof goToLeg;
	availability: { [segmentId: number]: { [familyId: string]: boolean } };
}

class Leg extends React.Component<Props> {
	shouldComponentUpdate(nextProps: Props): boolean {
		return this.props.prices !== nextProps.prices ||
			this.props.selectedFamilies !== nextProps.selectedFamilies ||
			this.props.combinations !== nextProps.combinations ||
			this.props.availability !== nextProps.availability ||
			this.props.flight !== nextProps.flight;
	}

	@autobind
	onChange(segmentId: number, familyId: string): void {
		this.props.selectFamily(this.props.flight.legId, segmentId, familyId);
	}

	@autobind
	onAction(event: React.MouseEvent<HTMLDivElement>): void {
		event.stopPropagation();
		event.preventDefault();

		this.props.goToLeg(this.props.flight.legId);
	}

	@autobind
	renderActionBlock(): React.ReactNode {
		return <div className="flight-summary__right">
			<Button onClick={this.onAction} color="secondary">Изменить</Button>
		</div>;
	}

	render(): React.ReactNode {
		const { flight, combinations, prices, availability } = this.props;
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		return <Flight
			{...this.props}
			className={classnames('flight', { flight_direct: true })}
			isToggleable={false}
			showDetails={true}
			renderActionBlock={this.renderActionBlock}
		/>;

		// return <div className="fareFamilies-leg">
		// 	<div className="fareFamilies-leg__segments">
		// 		{flight.segments.map((segment, index) => {
		// 			const segmentId = `S${index}`;
		// 			const enabledFamilies = availability ? availability[index] : {};
		// 			const families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];
		//
		// 			return <Segment
		// 				key={segmentId}
		// 				segmentId={segmentId}
		// 				segment={segment}
		// 				enabledFamilies={enabledFamilies}
		// 				initialCombination={initialCombinationsBySegments[index]}
		// 				families={families}
		// 				isAvailable={!!combinations && !!families}
		// 				onChange={this.onChange}
		// 				prices={prices ? prices[index] : {}}
		// 			/>;
		// 		})}
		// 	</div>
		// </div>;
	}
}

export default Leg;
