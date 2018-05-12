window.StateProperty = class StateProperty {
	constructor(config = {}) {
		Object.assign(this, config);
	}
};

window.state = function state(proto, field, descriptor) {
	let initialValue = descriptor.initializer && descriptor.initializer();
	let config = new StateProperty;

	if(initialValue instanceof StateProperty) {
		config = initialValue;
		initialValue = config.value;
	}

	let originalCWU = proto.componentWillUnmount || (fn => {});

	proto.componentWillUnmount = function() {
		this.state$abandonShip = true;

		return originalCWU.apply(this, arguments);
	};

	proto.state$initDeferred = function state$initDeferred() {
		if('state$deferred' in this == false) {
			// console.log(this.constructor.name + this.id + ':ClearDeferStateA');
			this.state$deferred = {};
			this.state$deferredPromise = null;
			this.state$abandonShip = false;
		}
	};

	proto.state$applyDeferred = function state$applyDeferred() {
		this.allowRender = true;

		if(!this.state$deferred || this.state$abandonShip) {
			return;
		}

		// console.log(this.constructor.name + this.id + ':CommitState', this.state$deferred);

		this.setState(this.state$deferred);

		// console.log(this.constructor.name + this.id + ':ClearDeferStateB');

		this.state$deferred = {};
	};

	proto.commitState = function() {
		if(this.state$deferredPromise) {
			this.state$deferredPromise.cancel();
			this.state$deferredPromise = null;
		}

		this.state$applyDeferred();
	};

	return {
		get() {
			this.state$initDeferred();

			if(field in this.state$deferred) {
				return this.state$deferred[field];
			}

			if(!this.state || field in this.state == false) {
				this.state = this.state || {};
				this.state[field] = initialValue;
			}

			return this.state[field];
		},

		set(value) {
			this.state$initDeferred();

			const context = {stop: false};

			if(config.set) {
				value = config.set.apply(this, [value, context]);
			}

			if(context.stop) {
				return;
			}

			// console.log(this.constructor.name + this.id + ':SetState', field);
			// this.setState({ [field]: value });

			this.state$deferred[field] = value;

			if(this.state$deferredPromise) {
				this.state$deferredPromise.cancel();
				this.state$deferredPromise = null;
			}

			this.state$deferredPromise = delay().then(fn => this.state$applyDeferred());
		}
	};
};

window.storedState = function storedState(proto, field, descriptor) {
	// let defaultValue = descriptor.initializer && descriptor.initializer();
	//
	// return {
	// 	get() {
	// 		if(!this.state || field in this.state == false) {
	// 			this.state = this.state || {};
	// 			this.state[field] = defaultValue;
	// 		}
	//
	// 		return this.state[field];
	// 	},
	// 	set(value) {
	// 		this.setState({[field]: value});
	// 	}
	// };
};

global.prop = function prop(proto, field, descriptor) {
	let defaultValue = (descriptor.initializer && descriptor.initializer()) || proto[field];

	return {
		get() {
			if(field in this.props == false) {
				return defaultValue;
			}

			return this.props[field];
		}
	};
};

window.internal = function internal(proto, field, descriptor) {
	let value = decoratedValue(proto, field, descriptor, fn => '');

	return {
		get: v => value,
		set: v => value = v,
		enumerable: false,
	};
};

global.hook = function hook(proto, field, descriptor) {
	const defaultRenderer = decoratedValue(proto, field, descriptor, fn => '');

	const hasHooked    = `has${field.ucFirst()}`;
	const beforeHooked = `before${field.ucFirst()}`;
	const renderHooked = `render${field.ucFirst()}`;
	const afterHooked  = `after${field.ucFirst()}`;

	Object.defineProperty(proto, hasHooked, {
		enumerable: false,
		configurable: true,

		get() {
			return true;
		}
	});

	Object.defineProperty(proto, beforeHooked, {
		enumerable: false,
		configurable: true,

		value() {
			return undefined;
		}
	});

	Object.defineProperty(proto, renderHooked, {
		enumerable: false,
		configurable: true,

		value() {
			return defaultRenderer.apply(this);
		}
	});

	Object.defineProperty(proto, afterHooked, {
		enumerable: false,
		configurable: true,

		value() {
			return undefined;
		}
	});

	return {
		enumerable: false,
		configurable: true,

		get() {
			if(this[hasHooked] == false) {
				return '';
			}

			return (
				<___>
					{this[beforeHooked]()}
					{this[renderHooked]()}
					{this[afterHooked]()}
				</___>
			);
		}
	}
}
