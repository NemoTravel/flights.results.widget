import * as React from 'react';
import * as classnames from 'classnames';
import autobind from 'autobind-decorator';
import Button from '@material-ui/core/Button/Button';

import FamiliesSegment from './Segment';
import SegmentModel from '../../schemas/Segment';
import FlightModel from '../../models/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { SelectedFamiliesState } from '../../store/fareFamilies/selectedFamilies/reducers';
import { selectFamily } from '../../store/fareFamilies/selectedFamilies/actions';
import { goToLeg } from '../../store/currentLeg/actions';
import Money from '../../schemas/Money';
import Flight from '../Flight';
import Segment from '../Flight/Segment';

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

	@autobind
	renderDetails(): React.ReactNode {
		const segments = this.props.flight.segments;

		return <div className="flight-details">
			{this.renderFamilies(segments[0], 0)}

			{segments.slice(1).map((segment, index) => (
				<Segment key={index} segment={segment} renderAdditionalBlock={() => {
					return this.renderFamilies(segment, index);
				}}/>
			))}
		</div>;
	}

	renderFamilies(segment: SegmentModel, index: number): React.ReactNode {
		const { combinations, prices, availability } = this.props;
		const segmentId = `S${index}`;
		const enabledFamilies = availability ? availability[index] : {};
		const families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		return !!combinations && !!families ? <FamiliesSegment
			key={segmentId}
			segmentId={segmentId}
			segment={segment}
			enabledFamilies={enabledFamilies}
			initialCombination={initialCombinationsBySegments[index]}
			families={families}
			onChange={this.onChange}
			prices={prices ? prices[index] : {}}
		/> : null;
	}

	render(): React.ReactNode {
		return <Flight
			{...this.props}
			className={classnames('flight', { flight_direct: true })}
			alwaysUpdate={true}
			isToggleable={false}
			showDetails={true}
			renderDetails={this.renderDetails}
			renderActionBlock={this.renderActionBlock}
		/>;
	}
}

export default Leg;
