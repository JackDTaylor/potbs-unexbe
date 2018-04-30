if('URL' in window == false) {
	window.URL = {};
}

let urlParser = document.createElement('a');

class URLData {
	parser = null;

	protocol = '';
	hostname = '';
	port     = '';
	pathname = '';
	search   = '';
	hash     = '';

	constructor(url) {
		this.parser = document.createElement('a');
		this.parser.href = url;

		this.protocol = this.parser.protocol;
		this.hostname = this.parser.hostname;
		this.port     = this.parser.port;
		this.pathname = this.parser.pathname;
		this.search   = this.parser.search;
		this.hash     = this.parser.hash;
	}

	get href() {
		this.parser.protocol = this.protocol;
		this.parser.hostname = this.hostname;
		this.parser.port     = this.port;
		this.parser.pathname = this.pathname;
		this.parser.search   = this.search;
		this.parser.hash     = this.hash;

		return this.parser.href;
	}
}

window.URL.parseReadonly = function parseReadonly(url) {
	urlParser.href = url;

	return {
		href:     urlParser.href,
		protocol: urlParser.protocol,
		hostname: urlParser.hostname,
		port:     urlParser.port,
		pathname: urlParser.pathname,
		search:   urlParser.search,
		hash:     urlParser.hash
	};
};

window.URL.parse = function parse(url) {
	return new URLData(url);
};
window.URL.clean = function parse(url) {
	return '/' + url.trim('/').replace(/\/+/g, '/');
};

window.URL.withParams = function withParams(url, params) {
	return url.replace(RouteManager.ParamRegex, param => {
		return params[param.trim('{}')] || '';
	});
};