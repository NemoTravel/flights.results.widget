if (!String.prototype.startsWith) {
	Object.defineProperty(String.prototype, 'startsWith', {
		enumerable: false,
		configurable: false,
		writable: false,
		value: function(searchString: string, position: number = 0) {
			return this.indexOf(searchString, position) === position;
		}
	});
}
