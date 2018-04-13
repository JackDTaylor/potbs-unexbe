const LITERAL_PARAM_REGEX = /{(\w+)}/g;
const NUMERIC_PARAM_REGEX = /#(\w+)#/g;

const PARAM_REGEX = /(?:{(\w+)}|#(\w+)#)/g;

export default class EndpointBundle {


	childEndpoints = {};

	constructor(childEndpoints) {
		this.childEndpoints = childEndpoints;
	}

	async route(path, outParams = {}) {
		if(path === '') {
			path = '/';
		}

		for(let mask in this.childEndpoints) {
			if(this.childEndpoints.hasOwnProperty(mask) == false) {
				continue;
			}

			let endpoint = this.childEndpoints[mask];

			// Check if this is an index route
			if(mask == '/') {
				if(mask == path) {
					outParams.subroute = '';
					return endpoint;
				}

				continue;
			}

			// This is a regular route
			let m, paramNames = [];

			while(m = PARAM_REGEX.exec(mask)) {
				paramNames.push(m[1] || m[2]);
			}

			let pattern = mask
				.replace(NUMERIC_PARAM_REGEX, '([0-9]+)')
				.replace(LITERAL_PARAM_REGEX, '([-a-zA-Z0-9_]+)')
				+ '(/.*|$)'
			;

			let regex = new RegExp(pattern);
			let match = regex.exec(path);

			if(match) {
				paramNames.forEach((param, i) => {
					outParams[param] = match[i+1];
				});

				outParams.subroute = match[paramNames.length+1];

				return endpoint;
			}
		}

		outParams.subroute = '';
		return false;
	}
}