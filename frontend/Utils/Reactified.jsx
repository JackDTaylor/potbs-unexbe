import Loading from "../Common/Typography/Loading";

global.awaitEx = function awaitEx(val, resolver) {
	if(val instanceof Bluebird && val.isFulfilled()) {
		resolver(val.value());
		return true;
	} else if(val instanceof Promise == false) {
		resolver(val);
		return true;
	}

	// Either a regular promise or not resolved Bluebird

	val.then(resolver);
	return false;
};

global.reactified = function(Cls) {
	Cls.prototype['@@iterator'] = function*() {
		const reactifier = this.toReact || (fn => <b>[{this.constructor.name}::toReact]</b>);

		yield (
			<React.Fragment key={0}>
				{reactifier.apply(this)}
			</React.Fragment>
		);
	}
};


let pc = new CacheStorage;
global.pc = pc;
let idCounter = 1;
let VOID = { $symbol:'VOID' };

class PromiseReactRenderer extends React.PureComponent {
	@prop promise;
	@state result = VOID;

	isCancelled = false;

	constructor() {
		super(...arguments);

		this.id = idCounter++;
	}

	async componentWillMount() {
		// console.log('PRR-P:', this.id, pc.id(this.promise));
		// console.log('PromiseReactRenderer' + this.id, 'CWM', this.promise);
		let result = await this.promise;
		// console.log('PromiseReactRenderer' + this.id, 'Await');

		if(this.isCancelled == false) {
			// console.log('PromiseReactRenderer' + this.id, 'Resolve');
			this.result = result;
			this.commitState();
		}
	}

	componentWillReceiveProps() {
		// console.log('PromiseReactRenderer'+ this.id, 'CWRP');
	}

	componentWillUnmount() {
		// console.log('PromiseReactRenderer'+ this.id, 'CWU');
		this.isCancelled = true;

		// if(this.promise.cancel) {
		// 	this.promise.cancel();
		// }
	}

	render() {
		if(this.result === VOID) {
			// console.log('PromiseReactRenderer'+ this.id, 'Render LOADER');
			return <Loading />;
		}

		// console.log('PromiseReactRenderer'+ this.id, 'Render FULL');

		return empty(this.result) ? '' : this.result;
	}
}

[Promise.prototype, Bluebird.prototype].forEach(PromisePrototype => {
	Object.defineProperty(PromisePrototype, '@@iterator', {
		enumerable: false,
		value: function*() {
			yield <React.Fragment key={this}>{this.toReact()}</React.Fragment>;
		}
	});

	Object.defineProperty(PromisePrototype, 'toReact', {
		enumerable: false,
		value() {
			if(this.isFulfilled()) {
				return this.value();
			}
			// console.warn('Not fulfilled promise', this);
			return <PromiseReactRenderer promise={this} />;
		}
	});
});



class ArrayReactRenderer extends React.Component {
	@prop limit = 2;
	@prop array;

	separator(left) {
		if(left > 0) {
			return (left > 1) ? ', ' : ' и ';
		}

		return '';
	}

	render() {
		const array = this.array.slice(0, this.limit);
		const overflow = this.array.length - array.length;

		return (
			<React.Fragment>
				{array.map((item, i) => (
					<React.Fragment key={i}>
						{item}
						{this.separator(array.length - i - !overflow)}
					</React.Fragment>
				))}

				{!overflow || `еще ${overflow}`}
			</React.Fragment>
		);
	}
}
Object.defineProperty(Array.prototype, 'toReact', {
	enumerable: false,
	value() {
		return <ArrayReactRenderer array={this} />;
	}
});