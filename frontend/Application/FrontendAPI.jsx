class ApiError extends Error {
	message;
	code;

	constructor(message, code) {
		super();

		this.code = code;
		this.message = message;
	}
}

function buildQuery(query) {
	//noinspection ES6ModulesDependencies,NodeModulesDependencies
	return decodeURIComponent(jQuery.param(query));
}

const bs = {};

// async function waitBatchSession(model) {
// 	await delay(50);
// 	let ids = bs[model].ids.unique();
// 	delete bs[model];
// 	console.warn('LOAD', model, ids);
// 	let models = await API.get('entity', {model}, {id: JSON.stringify(ids)});
// 	return Object.combine(models.map(m => m.id), models);
// }
//
// async function batchFindEntity(model, id) {
// 	if(model in bs == false) {
// 		console.verbose('START', model);
// 		bs[model] = { promise: waitBatchSession(model), ids: [] };
// 	}
//
// 	bs[model].ids.push(id);
//
// 	console.verbose('    ADD', model, id);
//
// 	return (await bs[model].promise)[id];
// }

const batchSessions = {};

class Batch {
	static Workers = {};

	static worker(sessionId, resolver) {
		if(sessionId in this.Workers == false) {
			this.Workers[sessionId] = new Batch(sessionId, resolver);
		}

		return this.Workers[sessionId];
	}

	sessionId;
	promise;
	lifetime;
	values;
	resolver;

	constructor(sessionId, lifetime = 50) {
		this.sessionId = sessionId;
		this.lifetime = lifetime;
		this.values = [];

		this.promise = this.run();
	}

	async run() {
		await delay(this.lifetime);
		delete Batch.Workers[this.sessionId];

		return await this.resolver(this.values.unique());
	}

	async resolve(value, resolver) {
		let valueMode = arguments.length > 1;

		if(valueMode) {
			this.values.push(value);
		} else {
			resolver = value;
			value = null;
		}

		this.resolver = resolver;

		let result = await this.promise;

		return valueMode ? result[value] : result;
	}
}

export default class FrontendAPI {
	static async entityLayout(model) {
		return await Batch.worker(`entityLayout:${model}`).resolve(async() => {
			return await API.get('entityLayout.get', {model});
		})
	}

	static async findEntity(model, id) {
		return await Batch.worker(`findEntity:${model}`).resolve(id, async ids => {
			if(ids.length < 1) {
				return {};
			}
			let id = JSON.stringify(ids);

			// TODO: Deal with paging
			return (await API.get('entity', {model}, {id, count: ids.length})).indexBy(m => m.id);
		});
	}

	static async createEntity(model, data = {}) {
		return await API.post(RequestType.POST, 'entity', {model}, data);
	}

	static async listEntity(model, params = {}, outMeta = {}) {
		if(params.filter) {
			params.filter = JSON.stringify(params.filter);
		}

		if(params.order) {
			params.order = JSON.stringify(params.order);
		}

		return await API.get('entity', {model}, params, outMeta);
	}

	static async updateEntity(model, id, data) {
		return await API.put('entity', {model, id}, data);
	}

	static async removeEntity(model, id) {
		return await API.delete('entity', {model, id});
	}

	static async fetch(method, endpoint, query, body, outMeta = {}) {
		method = method.toUpperCase();

		let url = `/api/${endpoint}`;

		if(query) {
			url += `?${buildQuery(query)}`;
		}

		const handler = function(resolve, reject, onCancel) {
			let request = null;

			const ajaxHandler = function(xhr, status) {
				const abortStatuses = ["abort"];
				const errorStatuses = ['nocontent','error','timeout','parsererror'];
				const successStatuses = ['notmodified', 'success'];

				if(errorStatuses.has(status)) {
					if(xhr.status && xhr.responseJSON) {
						reject(new ApiError(xhr.responseJSON.errorMessage, xhr.status));
						return;
					}

					// retry
					if(--config.executionAttempts > 0) {
						return jQuery.ajax(config);
					}

					console.warn(status, xhr);
					reject(new Error(status));
				}

				if(status == "notmodified") {
					console.warn('NOTMODIFIED', xhr);
				}

				if(successStatuses.has(status)) {
					let response = xhr.responseJSON;

					if(response.meta) {
						Object.assign(outMeta, response.meta);
					}

					return resolve(response.result);
				}

				reject(new Error("Unable to resolve promise for unknown reason"));
			};

			if(method != RequestType.GET) {
				body = JSON.stringify(body);
			}

			let config = {
				url, method,
				data: body,
				dataType: 'json',
				contentType: 'application/json',
				complete: ajaxHandler,
				executionAttempts: 5
			};

			request = jQuery.ajax(config);

			onCancel(fn => request.abort());
		};

		return new Bluebird(handler);
	}

	static async get(endpoint, query, body, outMeta = {}) {
		return await API.fetch(RequestType.GET, endpoint, query, body, outMeta);
	}

	static async post(endpoint, query, body, outMeta = {}) {
		return await API.fetch(RequestType.POST, endpoint, query, body, outMeta);
	}

	static async put(endpoint, query, body, outMeta = {}) {
		return await API.fetch(RequestType.PUT, endpoint, query, body, outMeta);
	}

	// noinspection ReservedWordAsName
	static async delete(endpoint, query, body, outMeta = {}) {
		return await API.fetch(RequestType.DELETE, endpoint, query, body, outMeta);
	}
}

/** @type {typeof FrontendAPI} */
global.API = FrontendAPI;