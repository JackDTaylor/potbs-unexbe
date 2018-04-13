window.state = function state(proto, field, descriptor) {
	let initialValue = descriptor.initializer && descriptor.initializer();

	return {
		get() {
			if(!this.state || field in this.state == false) {
				this.state = this.state || {};
				this.state[field] = initialValue;
			}

			return this.state[field];
		},
		set(value) {
			this.setState({[field]: value});
		}
	};
};

window.prop = function prop(proto, field) {
	return {
		get() {
			return this.props[field];
		}
	};
};

window.internal = function internal(proto, field, descriptor) {
	let value = proto[field] || (descriptor.initializer && descriptor.initializer());

	return {
		get: v => value,
		set: v => value = v,
		enumerable: false,
	};
};

