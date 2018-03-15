/* global describe */
/* global it */
/* global expect */

import { getSegment } from '../../../schemas/__mocks__/Segment';
import { createSegmentUID } from '../flight';

describe('createSegmentUID', () => {
	it('should return correct part of the flight UID', () => {
		const segment = getSegment();

		expect(createSegmentUID(segment)).toMatch(/\w{2}-\d+_\d+(pc|kg|lb)/);
	});
});
