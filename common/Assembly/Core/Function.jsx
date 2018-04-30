Function.prototype.toJSON = function() {
	return { $fn: this.toString() };
};