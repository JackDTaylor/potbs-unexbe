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

class ReactComponent extends React.Component {

	/** @type String[] */
	get cssClass() { return [] };

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

	// noinspection JSDuplicatedDeclaration
	componentWillMount() {}                  // noinspection JSDuplicatedDeclaration
	componentDidMount() {}                   // noinspection JSDuplicatedDeclaration
	componentWillReceiveProps(){}            // noinspection JSDuplicatedDeclaration
	shouldComponentUpdate() { return true; } // noinspection JSDuplicatedDeclaration
	componentWillUpdate() {}                 // noinspection JSDuplicatedDeclaration
	componentDidUpdate() {}                  // noinspection JSDuplicatedDeclaration
	componentWillUnmount() {}

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

window.ReactComponent = ReactComponent;