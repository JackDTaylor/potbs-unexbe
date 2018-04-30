const idPropertyNameFromFullRules = [
	{regex: /ss$/,   suffix: 'ss_id'},
	{regex: /sses$/, suffix: 'ss_ids'},
	{regex: /ies$/,  suffix: 'y_ids'},
	{regex: /s$/,    suffix: '_ids'},
];

global.idPropertyNameFromFull = function idPropertyNameFromFull(propertyName) {
	//const testFn = fn => {
	// 	const r = {}, t = {
	// 		tests      : 'test_ids',
	// 		addresses  : 'address_ids',
	// 		properties : 'property_ids',
	// 		test       : 'test_id',
	// 		address    : 'address_id',
	// 		property   : 'property_id',
	// 	};
	// 	Object.keys(t).forEach(key => r[ key ] = idPropertyNameFromFull(key));
	// 	return r;
	//};
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
};