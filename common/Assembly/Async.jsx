import Bluebird from 'bluebird';

global.Bluebird = Bluebird;
global.Promise = Bluebird;

Bluebird.config({
	cancellation: true,
	warnings: false,
	longStackTraces: false,
	monitoring: false
});


global.delay = function delay(timeout = 0) {
	if(valueType(timeout) == Function) {
		setTimeout(timeout, 0);
	}

	return new Bluebird(function(resolve, reject, onCancel) {
		let id = setTimeout(() => {
			try {
				resolve();
			} catch(e) {
				reject(e);
			}
		}, timeout);

		onCancel(fn => clearTimeout(id));
	});
};

global.condition = function condition(callback, tickTime = 25) {
	let timePassed = 0;

	return new Bluebird(function(resolve, reject) {
		let intervalId = setInterval(fn => safeResolve(() => {
			timePassed += tickTime;

			let value = callback(timePassed);

			if(value) {
				clearInterval(intervalId);
				safeResolve(resolve, reject, value);
			}
		}, reject), tickTime);
	});
};

global.safeResolve = function safeResolve(resolve, reject, ...resolveArgs) {
	try {
		return resolve(...resolveArgs);
	} catch(error) {
		return reject(error);
	}
};