// Only DB-independent imports are allowed
import {APPROOT} from "../config";
import errorPageTemplate from "./../views/error";

import Mysql from "./Mysql";
import SessionStorage from "./SessionStorage";
import Lang from "./Lang";
import Version from "./Version";
import RendererChecker from "./Renderers/RendererChecker";

global.Version = Version;

let Context = null;
let contextIdCounter = 0;

let instance = null;

export default class Application {
	static get Instance() {
		return instance || (instance = new Application());
	}

	dpr(dprResponse) {
		if(contextIdCounter < 1) {
			// Application haven't been initialized yet
			throw new FlowInterrupter(dprResponse);
		}

		Object.values(this.activeContexts).forEach(ctx => ctx.sendDprResponse(dprResponse));
	}

	/** @type {Object.<string, Context>} */
	activeContexts = {};

	get activeContextIds() {
		return Object.keys(this.activeContexts);
	}

	static basePath = APPROOT;

	static path(...subPaths) {
		subPaths = subPaths.join('/');

		return this.basePath + subPaths;
	}

	/**
	 * Initializes the server
	 * @return {Promise.<void>}
	 */
	async initialize() {
		await Lang.load('ru');

		await Bluebird.all([
			RendererChecker.Check('Cell'),
			RendererChecker.Check('Field'),
			RendererChecker.Check('Detail'),
			Mysql.Initialize(),
			SessionStorage.Instance.initialize(),
		]);

		// Dynamic import because Context can use models from DB
		Context = require("./Context").default;
	}

	/**
	 * @param server
	 * @param {Request} request
	 * @param {Response} response
	 *
	 * @return {Promise.<void>}
	 */
	async resolve(server, request, response) {
		let context = null;

		try {
			console.log();
			console.info(`[${(new Date).toLocaleTimeString()}]`, request.method, request.url);

			context = new Context(server, this, request, response);

			await context.prepare();
			await context.resolve();

			if(response.headersSent == false) {
				response.send('[empty response]');
			}
		} catch(error) {
			Application.HandleError(request, response, error)
		} finally {
			if(context && context.id) {
				this.unregisterContext(context.id);
			}
		}
	}

	/**
	 * Handles an error (no matter if application has been initialized or not)
	 * @param request
	 * @param response
	 * @param error
	 * @constructor
	 */
	static HandleError(request, response, error) {
		if(error && error.isFlowInterrupter && response.headersSent) {
			return;
		}

		if(isAjax(request)) {
			return response.status(551).send({
				v: Version.Sync().primary,
				error: 551,
				errorMessage: error.message,
			});
		}

		console.error("###### Error occured ########");
		console.error(error);
		console.error("#############################");

		return response.send(errorPageTemplate({ error, devMode: isDeveloper(request) }));
	}

	/**
	 * Shuts down the server
	 */
	exit() {
		console.clear();
		console.warn('Shutting down the server');
		try {
			SessionStorage.Instance.save();
		} catch(e) {
			console.error(e);
		}

		console.warn('------------------------');
		process.exit(1);
	}

	registerContext(context) {
		const id = ++contextIdCounter;
		this.activeContexts[id] = context;
		return id;
	}

	unregisterContext(contextId) {
		if(contextId in this.activeContexts) {
			delete this.activeContexts[contextId];
		}
	}
}

global.Application = Application;
