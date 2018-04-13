import Application from "./../core/Application";
import {FileSystemSync} from "../core/FileSystem";

const consoleFile = Application.Instance.path('/tmp/console.log');

function consoleLogToFile(data, prefix = '', suffix = '') {
	FileSystemSync.append(consoleFile, prefix + _dpr(data, ' ', true) + suffix + "\n");
}

global.console.clear = function() {
	FileSystemSync.write(consoleFile, '');
};

global.console.original = global.console.log;

global.console.log = function(...data) {
	consoleLogToFile(data);
};

global.console.decorator = function() {
	console.log(...arguments);

	return arguments.length > 1 ? arguments[2] : arguments[0];
};

global.console.info = function(...data) {
	consoleLogToFile(data, '\x1b[46m\x1b[1m\x1b[30m', '\x1b[0m\x1b[49m');
};

global.console.warn = function(...data) {
	consoleLogToFile(data, '\x1b[33m[!] ', '\x1b[0m');
};

global.console.error = function(...data) {
	consoleLogToFile(data, '\x1b[0;31m', '\x1b[0m');
};

global.console.assert = function(condition, msg = '') {
	if(!condition) {
		throw `Assertion failed${msg && `, that ${msg}`}`;
	}

	return condition;
};
