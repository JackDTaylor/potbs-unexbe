global.LoadRenderers = async function() {
	await ['Cell', 'Field', 'Detail'].forEachAsyncConcurrent(async type => {
		const renderers = global[`${type}Renderers`];

		Object.defineProperty(renderers, 'classes', {
			value: {},
			enumerable: false,
		});

		await Object.keys(renderers).forEachAsyncConcurrent(async key => {
			renderers.classes[ renderers[key] ] = (await Bluebird.resolve(import("./" + renderers[key]))).default;
		});
	});
};

global.GetRenderer = function(code) {
	let [type] = code.split('/');

	type += 'Renderers';

	if(!global[type] || code in global[type].classes == false) {
		throw new Error(`Renderer '${code}' not found`);
	}

	return global[type].classes[code];
};