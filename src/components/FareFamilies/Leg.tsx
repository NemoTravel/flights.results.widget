import * as React from 'react';
import * as classnames from 'classnames';
import autobind from 'autobind-decorator';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import FamiliesSegment from './Segment';
import SegmentModel from '../../schemas/Segment';
import FlightModel from '../../models/Flight';
import FareFamiliesCombinations from '../../schemas/FareFamiliesCombinations';
import { selectFamily } from '../../store/fareFamilies/selectedFamilies/actions';
import { goToLeg } from '../../store/currentLeg/actions';
import Money from '../../schemas/Money';
import Flight from '../Flight';
import Segment from '../Flight/Segment';

interface Props {
	flight: FlightModel;
	prices: { [segmentId: number]: { [familyId: string]: Money } };
	combinations: FareFamiliesCombinations;
	selectFamily: typeof selectFamily;
	goToLeg: typeof goToLeg;
	availability: { [segmentId: number]: { [familyId: string]: boolean } };
	showTitle: boolean;
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
		const initialCombinationsBySegments = combinations ? combinations.initialCombination.split('_') : '';

		// List of families on segment.
		let families = combinations ? combinations.fareFamiliesBySegments[segmentId] : [];
		// List of families on segment available for selection.
		let enabledFamilies = availability ? availability[index] : {};
		// Preselected family code.
		let initialFamilyCode = initialCombinationsBySegments[index];

		// If there are no info about families available for selection,
		// but we do have some information about current family on segment, use that instead.
		if ((!combinations || !families) && this.props.flight.segments[index]) {
			families = [ this.props.flight.segments[index].fareFamilyFeatures ];
			initialFamilyCode = 'F1';
			enabledFamilies = { F1: true };
		}

		return !!initialFamilyCode && !!families ? (
			<FamiliesSegment
				key={segmentId}
				segmentId={segmentId}
				intSegmentId={index}
				segment={segment}
				enabledFamilies={enabledFamilies}
				initialCombination={initialFamilyCode}
				families={families}
				onChange={this.onChange}
				prices={prices ? prices[index] : {}}
			/>
		) : null;
	}

	render(): React.ReactNode {
		const { combinations } = this.props;
		let shouldBeClosed = false;

		if (combinations) {
			let count = 0;

			// If we don't have enought families to show on all segments, just keep the flight block closed by default.
			for (const segmentId in combinations.fareFamiliesBySegments) {
				if (combinations.fareFamiliesBySegments.hasOwnProperty(segmentId) && combinations.fareFamiliesBySegments[segmentId].length === 1) {
					count++;
				}
			}

			shouldBeClosed = count === Object.keys(combinations.fareFamiliesBySegments).length;
		}

		return <>
			{this.props.showTitle ? <Typography className="fareFamilies-title" variant="headline">
				Выбор тарифа {this.props.flight.legId === 0 ? 'туда' : 'обратно'}
			</Typography> : null}

			<div>
				<Flight
					{...this.props}
					className={classnames('flight', { flight_direct: true })}
					alwaysUpdate={true}
					showDetails={!shouldBeClosed}
					renderDetails={this.renderDetails}
					renderActionBlock={this.renderActionBlock}
				/>
			</div>
		</>;
	}
}

export default Leg;
