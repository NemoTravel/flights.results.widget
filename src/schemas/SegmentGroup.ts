import Segment from './Segment';

export default interface SegmentGroup extends Segment {
	segments: Segment[];
}
