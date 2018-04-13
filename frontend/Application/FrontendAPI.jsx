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

export default class FrontendAPI {
	static async createEntity(model, data = {}) {
		return await API.fetch(RequestType.POST, 'entity', {model}, data);
	}

	static async listEntity(model, params = {}) {
		return await API.fetch(RequestType.GET, 'entity', {model}, params);
	}

	static async updateEntity(model, id, data) {
		return await API.fetch(RequestType.PUT, 'entity', {model, id}, data);
	}

	static async removeEntity(model, id) {
		return await API.fetch(RequestType.DELETE, 'entity', {model, id});
	}

	static async entityLayout(model, scope = '') {
		return await API.fetch(RequestType.GET, 'entityLayout.get', {model, scope});
	}

	static async fetch(method, endpoint, query, body) {
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
					return resolve(xhr.responseJSON.result);
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
}

/** @type {typeof FrontendAPI} */
global.API = FrontendAPI;