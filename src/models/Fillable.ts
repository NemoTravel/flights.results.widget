export default abstract class Fillable<T> {
	[fieldName: string]: any;

	constructor(source: T) {
		this.fill(source);
	}

	fill(source: T): void {
		for (const fieldName in source) {
			if (source.hasOwnProperty(fieldName)) {
				this[fieldName] = source[fieldName];
			}
		}
	}
}
