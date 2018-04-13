import Application from "./../core/Application";
import Util from 'util';

global._dpr = function _dpr(values, separator = "\n\n", colors = false) {
	if(values.some(val => typeof val == "object") === false) {
		return values.join(separator);
	}

	return values.map(v => {
		if(typeof v === "undefined") {
			return "undefined";
		}

		if(typeof v === "string" || typeof v === "number") {
			return v;
		}

		return Util.inspect(v, {depth: 5, colors});
	}).join(separator);
};

global.FlowInterrupter = class extends Error { isFlowInterrupter = true; };
global.dpr = function dpr(...values) {
	Application.Instance.dpr(_dpr(values));
	throw new FlowInterrupter();
};

