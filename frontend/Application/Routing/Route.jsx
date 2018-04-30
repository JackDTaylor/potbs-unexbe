let routeIdCounter = 1;

const paramTypes = {
	'any': '[^/]',
	'numeric': '\\d',
	'literal': '[-a-z_A-Z]',
};

export default class Route {
	static StaticPart = class StaticPart {
		value;

		constructor(value) {
			this.value = value;
		}

		get length() {
			return this.value.length;
		}

		get regex() {
			return RegExp.quote(this.value);
		}
	};

	static ParamPart = class ParamPart {
		type;
		name;

		constructor(query, index) {
			query = query.split(':');

			this.name = query[0] || `param${index}`;
			this.type = query[1] || 'any';
		}

		get length() {
			return Infinity;
		}

		get regex() {
			return `(${paramTypes[this.type] || paramTypes.any}+)`;
		}
	};

	static IsParam(path) {
		return RouteManager.ParamRegex.test(path);
	}

	id;
	url;
	endpoint;

	path;

	parts = [];

	isParamPart(i) {
		return this.paramMask & 2 ** (this.path.length - i - 1);
	}

	constructor(url, endpoint) {
		this.id = routeIdCounter++;
		this.url = URL.clean(url);
		this.endpoint = endpoint;

		const statics = this.url.split(RouteManager.ParamRegex);
		const params = RouteManager.ParamRegex.execAll(this.url)[0] || [];

		statics.forEach((val, i) => {
			if(val) {
				this.parts.push(new Route.StaticPart(val));
			}

			if(i < params.length) {
				this.parts.push(new Route.ParamPart(params[i].trim('{}')));
			}
		});
	}

	get regex() {
		return new RegExp('^' + this.parts.map(part => part.regex).join('') + '$');
	}

	get paramNames() {
		return this.parts.filter(p => p instanceof Route.ParamPart).map(p => p.name);
	}

	prepareParams(values) {

	}
}