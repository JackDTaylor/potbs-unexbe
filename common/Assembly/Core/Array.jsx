const arrayFn = function(name, value) {
	Object.defineProperty(Array.prototype, name, { enumerable: false, configurable: true, value });
};

const arrayGetter = function(name, get) {
	Object.defineProperty(Array.prototype, name, { enumerable: false, configurable: true, get });
};

/** @class Array
 *  @property first */
arrayGetter('first', function() {
	return this[0];
});

/** @class Array
 *  @property last */
arrayGetter('last', function() {
	return this[ this.length - 1 ];
});

/** @class Array
 *  @property has */
arrayFn('has', function(element) {
	return this.indexOf(element) >= 0;
});

/** @class Array
 *  @property indexBy */
arrayFn('indexBy', function(keyExpr) {
	return Object.combine(this.map(keyExpr), this);
});

/** @class Array
 *  @property mapAsyncConcurrent */
arrayFn('mapAsyncConcurrent', async function(callback) {
	let results = [];

	await this.forEachAsyncConcurrent(async(e, i) => {
		results[i] = await callback.apply(this, [this[i], i, this]);
	});

	return results;
});

/** @class Array
 *  @property forEachAsyncConcurrent */
arrayFn('forEachAsyncConcurrent', async function(callback) {
	await Bluebird.all(this.map(callback));
});

/** @class Array
 *  @property mapAsync */
arrayFn('mapAsync', async function(callback, thisArg = this) {
	const result = [];

	for(let i = 0; i < this.length; i++) {
		result[i] = await callback.apply(thisArg, [this[i], i, this]);
	}

	return result;
});

/** @class Array
 *  @property forEachAsync */
arrayFn('forEachAsync', async function(callback) {
	await this.mapAsync(callback);
});

/** @class Array
 *  @property @@iterator */
arrayFn('@@iterator', function() {
	throw new Error('Array @@iterator is used');
});

/** @class Array
 *  @property mapReact */
arrayFn('mapReact', function(fn) {
	return this.map((e, i) => <React.Fragment key={i}>{fn.apply(this, [e, i])}</React.Fragment>)
});

/** @class Array
 *  @property unique */
arrayFn('unique', function() {
	// noinspection CommaExpressionJS
	return this.reduce((a,k) => (a.has(k) || a.push(k), a), []);
});

/** @class Array
 *  @property sum */
arrayGetter('sum', function() {
	return this.reduce((p,c) => p+c, 0);
});

/** @class Array
 *  @property avg */
arrayGetter('avg', function() {
	return this.length > 0 ? this.reduce((p,c) => p+c, 0) / this.length : 0;
});