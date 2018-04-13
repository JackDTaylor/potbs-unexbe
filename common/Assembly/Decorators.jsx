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

		return {value};
	},
	valueDecorator(fn) {
		return (p, f, d) => _decoratorUtils.processValue(d, fn, [p,f,d]);
	}
};

const utils = _decoratorUtils;

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
		value: observableFn
	};
};

global.asyncCatch = function(proto, field, descriptor) {
	let original = utils.decoratedValue(descriptor, ()=>{});

	return {
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

global.abstract = function(proto, field, desc) {
	console.log(proto);
	if(valueType(proto) !== Function) {
		proto = proto.constructor;
	}

	proto = proto || Object;

	return {
		get() {
			throw new Error(`${proto.name}::${field} is marked as abstract and should be overriden`);
		}
	};
};

global.modelName = function(...args) {
	return function(Cls) {
		Cls.Name = new Noun(...args);
		return Cls;
	}
};

global.exclude = (name) => utils.valueDecorator(value => {
	utils.defineKey('exclude', value, []);

	value.exclude.push(name);
});

global.include = (name, params = {}) => utils.valueDecorator(value => {
	utils.defineKey('include', value, []);

	value.include.push({ name: name, type: Type.STRING, ...params });
});

global.extend = (name, params = {}) => utils.valueDecorator(value => {
	utils.defineKey('extend', value, {});

	value.extend[name] = params;
});

global.arrange = (...displayGroups) => utils.valueDecorator(value => {
	utils.defineKey('arrange', value, displayGroups);
});

global.hidden = utils.valueDecorator(value => {
	utils.defineKey('hidden', value, true);
});

global.scope = (scope) => utils.valueDecorator(value => {
	utils.defineKey('scope', value, scope);
});

global.property = function(proto, field, descriptor) {
	let value = utils.decoratedValue(descriptor, {});

	if(valueType(value) !== Object) {
		value = { expr: value };
	}

	value.expr = value.expr || null;

	if(value.set === false) {
		value.set = fn => console.error(`'${field}' property is readonly`);
	}

	let getter = value.get || (value.expr ? function() { return this.getDataValue(field); } : null);
	let setter = value.set || (value.expr ? function(val) { this.setDataValue(field, val); } : null);

	if(getter) {
		value.get = function() {
			return getter.apply(this, [this.getDataValue(field), ...arguments]);
		};
	} else {
		delete value.get;
	}

	if(setter) {
		value.set = function() {
			return setter.apply(this, arguments);
		};
	} else {
		delete value.set;
	}

	proto.CustomProperties = proto.CustomProperties || {};
	proto.CustomProperties[field] = value;

	return { value: proto.CustomProperties[field] };
};
