global.IsBackend = true;
global.IsFrontend = false;

import "./backend/utils";

import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'client-sessions';
import fileUpload from 'express-fileupload';
import {SERVER_PORT, SESSION_KEY, SESSION_SECRET} from "./backend/config";
import Application from "./backend/core/Application";

global.APP_START_TIME = Date.now();

(async function Bootstrap() {
	try {
		const app = Express();

		const resolveHandler = (...args) => Application.Instance.resolve(app, ...args);
		const exitHandler = (...args) => Application.Instance.exit(...args);

		process.on('exit', exitHandler);
		process.on('SIGINT', exitHandler);
		process.on('SIGUSR1', exitHandler);
		process.on('SIGUSR2', exitHandler);
		process.on('uncaughtException', exitHandler);

		await Application.Instance.initialize();

		app.use(Express.static('public'));
		app.use(bodyParser());
		app.use(cookieParser());
		app.use(fileUpload());

		app.use(cookieSession({
			cookieName: SESSION_KEY,
			secret: SESSION_SECRET,
			duration: Time.YEAR,
		}));

		console.warn('Started in', Date.now() - APP_START_TIME, 'ms');

		app.all('*', resolveHandler).listen(SERVER_PORT);
	} catch(e) {
		let dprMode = true;

		if(e instanceof FlowInterrupter == false) {
			dprMode = false;

			console.original(e);
			console.error(e);
		}

		// Launch emergency server
		Express().all('*', function(req, res) {
			if(dprMode && isDeveloper(req) && isAjax(req) == false) {
				res.set({'Content-Type': 'text/plain'});
				res.send('[EMERGENCY MODE]\n' + e.payload);
			}

			Application.HandleError(req, res, e);
		}).listen(SERVER_PORT);

		//
		// process.exit(1);
	}
})();