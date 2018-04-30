Object.without = function(obj, keys) {
	if(keys instanceof Array === false) {
		keys = [keys];
	}

	obj = {...obj};

	keys.forEach(key => delete obj[key]);

	return obj;
};

Object.equal = function(a, b, depth = 64, keys = []) {
	const aIsObject = a && typeof a == 'object';
	const bIsObject = b && typeof b == 'object';

	if(!aIsObject || !bIsObject) {
		// At least one of the values is scalar -- use regular compare
		return a === b;
	}

	if(a.constructor != b.constructor) {
		// Constructor differs
		return false;
	}

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if(aKeys.length != bKeys.length) {
		// Keys are different
		return false;
	}

	let foundDiff = aKeys.some(key => {
		if(key in b == false) {
			// Keys are different
			return true;
		}

		const aKeyIsObject = a[key] && a[key] instanceof Object;
		const bKeyIsObject = b[key] && b[key] instanceof Object;

		if(depth > 0 && aKeyIsObject && bKeyIsObject) {
			// Use recursive comparison.
			// Notice `!` in front of call -- we should return `true` if objects are _different_.
			return !(Object.equal(a[key], b[key], depth - 1, keys.concat([key])));
		}

		return a[key] !== b[key];
	});

	return !foundDiff;
};

Object.deepEqual = function(a, b) {
	return Object.equal(a, b, 64);
};

Object.extend = function(BaseCls, Cls) {
	let staticDescriptors = Object.getOwnPropertyDescriptors(Cls);
	let prototypeDescriptors = Object.getOwnPropertyDescriptors(Cls.prototype);

	delete staticDescriptors.prototype;
	delete staticDescriptors.name;
	delete prototypeDescriptors.constructor;

	if(Object.keys(staticDescriptors).length > 0) {
		Object.defineProperties(BaseCls, staticDescriptors);
	}

	if(Object.keys(prototypeDescriptors).length > 0) {
		Object.defineProperties(BaseCls.prototype, prototypeDescriptors);
	}

	return BaseCls;
};

Object.combine = function(keys = [], values = []) {
	const result = {};
	keys.forEach((key, i) => result[key] = values[i]);
	return result;
};

Object.pairs = function(obj) {
	return Object.keys(obj).map(key => ({ key, value: obj[key] }));
};