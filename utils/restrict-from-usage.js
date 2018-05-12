const fakeModule = (ns, msg) => `
{__esModule:true};

if('Proxy' in ${ns}) {
	module.exports = new Proxy({}, {
		get: function(target, key) {
			if(key == "__esModule") {
				return true;
			}
			
			throw new Error("${msg}::" + key);
		}
	});
}`.trim();


module.exports.restrictFromUsage = function(origin, env, globalNamespace, logUsages = false) {
	return function(context, request, callback) {
		if(request.indexOf(origin) >= 0) {
			if(logUsages) {
				console.warn(env, 'usage of', request);
			}

			const errorMsg = `${origin} module should not be used in ${env} environment: ${request}`;

			return callback(null, fakeModule(globalNamespace, errorMsg));
		}

		callback();
	};
};