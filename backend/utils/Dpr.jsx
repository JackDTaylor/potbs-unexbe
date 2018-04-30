import Application from "./../core/Application";
import Util from 'util';

global._dpr = function _dpr(values, separator = "\n\n", colors = false) {
	let stack;

	try { throw new Error('t'); } catch(e) {
		stack = e.stack.split('\n')[3];
		stack = stack.replace(/^.*\((.*)\).*$/, '$1');
		// stack = stack.replace(new RegExp('^' + RegExp.quote(Application.basePath)), '')
	}

	const header = `
##############################################################################
#
#    Debug print at
#      ${stack}
#
##############################################################################
	`.trim() + '\n\n';

	if(values.some(val => typeof val == "object") === false) {
		return values.join(separator);
	}

	return header + values.map((v, i) => {
		let title = `####### Index ${i} #`.padEnd(78, '#') + '\n';

		if(isUndefined(v)) {
			return title + "undefined";
		}

		if([Number, String].has(valueType(v))) {
			return title + v;
		}

		return title + Util.inspect(v, {depth: 5, colors});
	}).join(separator);
};

// noinspection JSUnusedLocalSymbols
global.FlowInterrupter = class extends Error {
	isFlowInterrupter = true;
	payload;

	constructor(payload = null) {
		super('Flow has been interrupted');

		this.payload = payload;
	}
};

global.dpr = function dpr(...values) {
	return Application.Instance.dpr(_dpr(values));
};
global.dpro = function dpro(...values) {
	values = values.map(v => {
		if(v instanceof Object == false) {
			return v;
		}

		let r = {};

		Object.getOwnPropertyNames(v).forEach(n => {
			r[n] = v[n];
		});

		return r;
	});

	return dpr(...values);
};

global.isAjax = function isAjax(request) {
	return request.headers['x-requested-with'] == 'XMLHttpRequest';
};

global.isDeveloper = function isDeveloper(request) {
	return request.headers['x-real-ip'] == '46.188.5.43';
};
