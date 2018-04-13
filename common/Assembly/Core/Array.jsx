export default () => {
	Array.prototype.first = function() {
		return this[0];
	};

	Array.prototype.last = function() {
		return this[ this.length - 1 ];
	};

	Array.prototype.has = function(element) {
		return this.indexOf(element) >= 0;
	};

	Array.prototype.mapAsyncConcurrent = async function(callback) {
		return await Promise.all(this.map(callback));
	};

	Array.prototype.forEachAsyncConcurrent = async function(callback) {
		await Promise.all(this.map(callback));
	};

	Array.prototype.mapAsync = async function(callback, thisArg = this) {
		const result = [];

		for(let i = 0; i < this.length; i++) {
			result[i] = await callback.apply(thisArg, [this[i], i, this]);
		}

		return result;
	};

	Array.prototype.forEachAsync = async function(callback) {
		await this.mapAsync(callback);
	};
}