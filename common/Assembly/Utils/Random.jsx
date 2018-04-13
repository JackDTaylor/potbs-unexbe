global.Random = class Random {
	/**
	 * Random value from 0 to 1
	 * @return {number}
	 */
	static get value() {
		return Math.random();
	}

	/**
	 * Returns random float between min and max
	 * @param min Minimal value, inclusive
	 * @param max Maximal value, inclusive
	 */
	static Range(min, max) {
		if(typeof max == "undefined") {
			max = min;
			min = 0;
		}

		return min + Random.value * max;
	}

	/**
	 * Returns random integer between min (inclusive) and max (non-inclusive)
	 * @param min Minimal value, inclusive
	 * @param max Maximal value, non-inclusive
	 */
	static RangeInt(min, max) {
		return Math.floor(Random.Range(min, max));
	}
};