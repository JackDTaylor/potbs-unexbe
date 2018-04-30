import Controller from "../core/Controller";
import AuthModule from "./api/AuthModule";
import EntityModule from "./api/EntityModule";
import FrontendModule from "./api/FrontendModule";
import EntityLayoutModule from "./api/EntityLayoutModule";

export default class ApiController extends Controller {
	get moduleClasses() {
		return [
			AuthModule,
			EntityModule,
			FrontendModule,
			EntityLayoutModule,
		];
	}

	get modules() {
		const classes = this.moduleClasses;
		const result = {};

		classes.forEach(cls => {
			const name = cls.name.replace(/Module$/, '').lcFirst();
			result[name] = cls;
		});

		return result;
	}

	getEndpoint() {
		let urlParts = this.context.request.url.slice(5).split('?');
		let requestedUrl = urlParts[0];

		let url = urlParts.first;

		url = url.replace(/\/+/g, '/');
		url = url.replace(/(^\/+|\/+$)/g, '');
		url = url.replace(/(^\.+|\.+$)/g, '');
		url = url.replace(/[^-.a-zA-Z0-9_/]/g, '');

		let query = urlParts.slice(1).join('?');
		let endpointParts = url.split('/').first.split('.');

		query = query ? `?${query}` : '';

		let module = endpointParts[0] || 'status';
		let endpoint = endpointParts[1] || 'default';

		let canonicUrl = `${module}.${endpoint}`;

		if(endpoint == 'default') {
			canonicUrl = module;
		}

		if(requestedUrl != canonicUrl) {
			return this.context.redirect(`/api/${canonicUrl}${query}`);
		}

		return { module, endpoint };
	}

	async resolve() {
		await this.context.autenticate();

		let request = this.getEndpoint();

		let module = request.module;
		let endpoint = request.endpoint;

		if(module in this.modules == false) {
			this.sendErrorResponse(404, "Module not found");
		}

		try {
			module = new this.modules[module](this);

			let result = await module.invoke(endpoint);

			this.sendResultResponse(result, module.responseMeta);
		} catch(error) {
			if(error.isFlowInterrupter) throw error;

			if(this.context.isAjax == false) {
			}

			Application.HandleError(this.context.request, this.context.response, error);

			this.sendErrorResponse(error.code || ErrorCode.E_INTERNAL, error.message);
		}
	}

	get responseParams() {
		return {
			v: this.context.version.primary,
		}
	}

	sendErrorResponse(code, message) {
		this.context.sendResponse({
			...this.responseParams,

			error: code,
			errorMessage: message,
		}, code);
	}

	sendResultResponse(result, meta = {}) {
		this.context.sendResponse({
			...this.responseParams,
			error: false,
			result: result,
			meta: empty(meta) ? undefined : meta
		});
	}
}