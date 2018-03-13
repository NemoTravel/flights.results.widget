/* global describe */
/* global it */
/* global expect */

import { getSegment } from '../../../schemas/__mocks__/Segment';
import { createFlightUIDPart } from '../flight';

describe('services/parsers/flight', () => {
	it('should return correct part of the flight UID', () => {
		const segment = getSegment();

		expect(createFlightUIDPart(segment)).toMatch(/\w{2}-\d+_\d+(pc|kg|lb)/);
	});
});
