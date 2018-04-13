// Only DB-independent imports are allowed
import {APPROOT} from "../config";
import Mysql from "./Mysql";
import errorPageTemplate from "./../views/error";
import SessionStorage from "./SessionStorage";
import {ModelFiles} from "../models";
import Lang from "./Lang";

let Context = null;
let contextIdCounter = 1;

let instance = null;

export default class Application {
	static get Instance() {
		return instance || (instance = new Application());
	}

	dpr(dprResponse) {
		Object.values(this.activeContexts).forEach(ctx => ctx.sendDprResponse(dprResponse));
	}

	/** @type {Object.<string, Context>} */
	activeContexts = {};

	get activeContextIds() {
		return Object.keys(this.activeContexts);
	}

	static async GetModel(modelName, rawMode = false) {
		modelName = modelName.replace(/[^a-zA-Z0-9/]/g, '');

		if(ModelFiles.has(`/${modelName}.jsx`) === false) {
			throw new Error(`Model '${modelName}' not found`);
		}

		let Model = (await import('../../models/' + modelName)).default;

		if(rawMode) {
			return Model;
		}

		Model.Backend.Code = modelName;
		Model.Backend.Name = Model.Name;

		return Model.Backend;
	}

	basePath = APPROOT;

	path(...subPaths) {
		subPaths = subPaths.join('/');

		return this.basePath + subPaths;
	}

	async initialize() {
		await Promise.all([
			Mysql.Initialize(),
			SessionStorage.Instance.initialize(),
			Lang.load('ru'),
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
			if(error && error.isFlowInterrupter && response.headersSent) {
				return;
			}

			console.error("###### Error occured ########");
			console.error(error);
			console.error("################### ##########");

			response.send(errorPageTemplate({ error }));
		} finally {
			if(context && context.id) {
				this.unregisterContext(context.id);
			}
		}
	}

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
		const id = contextIdCounter++;
		this.activeContexts[id] = context;
		return id;
	}

	unregisterContext(contextId) {
		if(contextId in this.activeContexts) {
			delete this.activeContexts[contextId];
		}
	}
}
