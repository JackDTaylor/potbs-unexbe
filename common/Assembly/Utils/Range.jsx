global.Range = class Range {
	from;
	to;

	constructor(from, to) {
		if(from > to) {
			[from, to] = [to, from];
		}

		this.from = from;
		this.to = to;
	}
};

global.range = function(from, to) {
	return new Range(from, to);
};