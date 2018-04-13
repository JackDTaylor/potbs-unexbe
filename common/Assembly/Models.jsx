export default global => {
	global.aggregation = function aggregation(BaseClass, ...Mixins) {
		const internalProps = /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/;

		function copyProperties(target, source) {
			const allPropertyNames = Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source));

			allPropertyNames.forEach((propertyName) => {
				if(!propertyName.match(internalProps)) {
					Object.defineProperty(
						target,
						propertyName,
						Object.getOwnPropertyDescriptor(source, propertyName)
					);
				}
			})
		}

		// noinspection JSUnusedLocalSymbols
		const Base = class extends BaseClass {
			constructor (...args) {
				super(...args);

				Mixins.forEach(Mixin => copyProperties(this, new Mixin(...args)));
			}
		};

		Mixins.forEach(Mixin => {
			copyProperties(Base, Mixin);
			copyProperties(Base.prototype, Mixin.prototype);
		});

		return Base;
	};

	// noinspection JSUnusedLocalSymbols
	global.BaseModel = class BaseModel {
		static Backend = $ => class extends $.base {};
		static Frontend = $ => class extends $.base {};

		static ListColumnOrder = [];
		static FormFieldOrder = [];
	};


	const idPropertyNameFromFullRules = [
		{regex: /ss$/,   suffix: 'ss_id'},
		{regex: /sses$/, suffix: 'ss_ids'},
		{regex: /ies$/,  suffix: 'y_ids'},
		{regex: /s$/,    suffix: '_ids'},
	];

	global.idPropertyNameFromFull = function idPropertyNameFromFull(propertyName) {
		// const testFn = fn => {
		// 	const r = {}, t = {
		// 		tests      : 'test_ids',
		// 		addresses  : 'address_ids',
		// 		properties : 'property_ids',
		// 		test       : 'test_id',
		// 		address    : 'address_id',
		// 		property   : 'property_id',
		// 	};
		// 	Object.keys(t).forEach(key => r[ key ] = idPropertyNameFromFull(key));
		// 	dpr(r);
		// };
		let found = false;

		idPropertyNameFromFullRules.some(rule => {
			if(rule.regex.test(propertyName)) {
				found = true;
				propertyName = propertyName.replace(rule.regex, rule.suffix);
			}

			return found;
		});

		if(!found) {
			return `${propertyName}_id`;
		}

		return propertyName;
	};

	global.fullPropertyNameFromId = function fullPropertyNameFromId(propertyName) {
		throw new Error('fullPropertyNameFromId() is not implemented yet');
	}
}