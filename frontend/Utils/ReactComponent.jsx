const camelHumpRegex = /([a-z0-9])([A-Z])/g;

const classObjToClassname = function(cls) {
	// Get array of present classes and `undefined`s
	// Filter `undefined`s
	// Join into a string since we want only strings in result

	return Object.keys(cls)
		.map(key => cls[key] && `js--${key}`)
		.filter(x=>x)
		.join(' ');
};

const classToClassname = function(cls, isComponent = true) {
	if(typeof cls == 'object') {
		cls = classObjToClassname(cls);
	} else if(isComponent) {
		cls = cls.replace(camelHumpRegex, '$1-$2');
		cls = cls.toLowerCase();
		cls = `dmi-${cls}`;
	}

	return cls;
};
const rawClassname       = cls => classToClassname(cls, false);
const componentClassname = cls => classToClassname(cls, true);

class ErrorBoundary extends React.Component {
	@state hasError = false;
	@state error = null;

	componentDidCatch(error, info) {
		this.error = error;
		// console.error(info);
	}

	render() {
		if(this.error) {
			return <b title={this.error}>[Error]</b>;
		}

		return this.props.children;
	}
}


class ReactComponent extends React.Component {

	/** @type String[] */
	get cssClass() {
		let obj = this.constructor.prototype;
		let names = [];

		while(obj) {
			let classes = [obj.constructor.name];

			if(Object.getOwnPropertyNames(obj.constructor).has('CssClasses')) {
				classes = obj.constructor.CssClasses;
			}

			names = names.concat(classes);

			obj = Object.getPrototypeOf(obj);

			if(!obj.constructor || !obj.constructor.name || obj.constructor == ReactComponent) {
				break;
			}
		}

		return names;
	};

	/** @type String[] */
	get additionalClasses() { return []; }

	get cls() {
		let additionalClasses = this.additionalClasses.map(rawClassname);

		if(this.props && this.props.classes && this.props.classes.root) {
			additionalClasses.push(this.props.classes.root);
		}

		return {
			className: 'dmi ' + (
				this.cssClass
					.map(componentClassname)         // Convert `SomeClass` to `dmi-some-class`
					.concat(additionalClasses)       // Add `additionalClasses`
					.concat([this.props.className])  // Add `props.className`
					.filter(x=>x)                    // Remove empty classes
					.join(' ')                       // Join everything into a string
					.replace(/\s+/, ' ')             // Collapse spaces
					.trim()                          // Trim spaces from begin and end
			)
		};
	}

	_subscriptions = [];

	subscribe(observable, handler = null) {
		if(!observable || !observable.$$observable) {
			console.warn('Value you\'re trying to subscribe to is not an observable');
			return;
		}

		if(!handler) {
			if(this[observable.name]) {
				handler = (...args) => this[observable.name](...args);
			} else {
				console.warn(`No handler was provided or found for subscribing to ${observable.name} in ${this.constructor.name}`);
				handler = fn => {};
			}
		}

		this._subscriptions.push(observable(handler));
	}

	componentWillMount() {}
	componentDidMount() {}
	componentWillReceiveProps(){}
	componentWillUpdate() {}
	componentDidUpdate() {}

	componentWillUnmount() {
		this._subscriptions.forEach(unsubscribe => unsubscribe());
	}

	constructor(...args) {
		super(...args);

		if(this.props && this.props.initialState) {
			this.state = this.props.initialState;
		}
	}
	render() {
		return '[ no render() ]';
	}
}

window.ErrorBoundary = ErrorBoundary;
window.ReactComponent = ReactComponent;