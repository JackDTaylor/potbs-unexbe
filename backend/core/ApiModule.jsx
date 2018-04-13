
export default class ApiModule {
	get endpoints() {
		return [];
	}

	/** @type {Context} */
	get context() {
		return this.controller.context;
	}

	/** @return {Request} */
	get request() {
		return this.context.request;
	}

	/** @return {AclUser} */
	get user() {
		return this.context.user;
	}

	/** @return {Object} */
	get session() {
		return this.context.session;
	}

	/** @return {Object} */
	get storedSession() {
		return this.context.storedSession;
	}

	/** @type {ApiController}*/
	controller = null;

	constructor(controller) {
		this.controller = controller;
	}

	async resolveByMethod(callbacks) {
		if(this.request.method in callbacks) {
			return await callbacks[this.request.method]();
		}

		if(callbacks.default) {
			return await callbacks.default();
		}
	}

	async invoke(method) {
		if(this.endpoints.has(method) == false) {
			this.errorResponse(404, "Not found");
		}

		method = `${method}Endpoint`;

		if(this[method] instanceof Function === false) {
			this.errorResponse(500, "Not implemented");
		}

		return await this[method]();
	}

	errorResponse(code, message) {
		this.controller.sendErrorResponse(code, message);
	}

	sendResponse(result) {
		this.controller.sendResultResponse(result);
	}
}