global._decoratorUtils = {
	defineKey(key, container, value = {}) {
		container[key] = container[key] || value;

		return container;
	},

	decoratedValue(descriptor, defaultValue = {}) {
		let value = descriptor.value || descriptor.initializer && descriptor.initializer();

		return value || defaultValue;
	},

	processValue(descriptor, fn, params) {
		const value = _decoratorUtils.decoratedValue(descriptor);

		fn(value, ...params);

		return { value, configurable: true };
	},

	valueDecorator(fn) {
		return (p, f, d) => _decoratorUtils.processValue(d, fn, [p,f,d]);
	}
};

const utils = _decoratorUtils;

global.defineKey = (k, v) => utils.valueDecorator(value => utils.defineKey(k, value, v));

global.observable = function observable() {
	const handlers = [];
	const observableFn = function(handler) {
		handlers.push(handler);
	};

	observableFn.invoke = function() {
		handlers.forEach(handler => handler.apply(this, arguments));
	};

	observableFn.invokeAsync = async function() {
		for(let i = 0; i < handlers.length; i++) {
			await handlers[i].apply(this, arguments);
		}
	};

	return {
		value: observableFn,
		configurable: true,
	};
};

global.cached = function(proto, field, descriptor) {
	const key = `${field}$cachedResult`;
	const getter = utils.decoratedValue(descriptor, ()=>{});

	return {
		async value() {
			if(!this[key]) {
				this[key] = await getter.apply(this, arguments);
			}

			return this[key];
		}
	}
};

global.cachedGet = function(proto, field, descriptor) {
	const key = `${field}$cachedResult`;
	const getter = descriptor.get;

	return {
		async get() {
			if(!this[key]) {
				this[key] = await getter.apply(this, arguments);
			}

			return this[key];
		}
	}
};

global.asyncCatch = function(proto, field, descriptor) {
	let original = utils.decoratedValue(descriptor, ()=>{});

	return {
		configurable: true,
		value: async function() {
			try {
				return await original.apply(this, arguments);
			} catch(error) {
				console.error(error);
				await AppController.routeError(500, {error});
			}
		}
	};
};

global.named = (...names) => Cls => {
	Cls.Name = new Noun(...names);
	return Cls;
};

global.registerBundle = url => Cls => {
	Cls.BundleURL = url;
	return Cls;
};