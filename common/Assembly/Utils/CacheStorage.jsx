global.LinearProgressionGenerator = function *LinearProgressionGenerator(step = 1) {
	let i = 0;

	while(true) {
		yield i += step;
	}
};

global.Counter = class Counter {
	constructor(step = 1) {
		this.counter = LinearProgressionGenerator(step);
	}

	get next() {
		return this.counter.next().value;
	}
};

global.CacheStorage = class CacheStorage extends Map {
	idCounter = new Counter;

	id(val) {
		if(this.has(val) == false) {
			this.set(val, this.idCounter.next);
		}

		return this.get(val);
	}
};
