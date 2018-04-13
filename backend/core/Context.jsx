import ACL from "./ACL";
import SessionStorage from "./SessionStorage";
import PageController from "../logic/PageController";
import ApiController from "../logic/ApiController";
import Application from "./Application";

export default class Context {
	id;
	server;
	application;
	request;
	response;
	session;
	storedSession;
	acl;

	get user() {
		return this.acl.user;
	}

	constructor(server, application, request, response) {
		this.server = server;
		this.application = application;
		this.request = request;
		this.response = response;

		this.id = this.application.registerContext(this);
	}

	sendResponse(response, code = 200) {
		this.response.status(code).send(response);
		throw new FlowInterrupter;
	}

	sendDprResponse(response) {
		if(this.response.headersSent) {
			console.warn('HEADERS ALREADY SENT!');
			console.warn(Object.keys(Application.Instance.activeContexts));

			throw new FlowInterrupter;
		}

		this.response.set({'Content-Type': 'text/plain'});
		this.sendResponse(response);
	}

	redirect(url, ...params) {
		this.response.redirect(url, ...params);
		throw new FlowInterrupter;
	}

	async prepare() {
		this.session = this.request.session;
		this.storedSession = SessionStorage.Instance.getSession(this.session.storageKey);
		this.session.storageKey = this.storedSession.storageKey;
	}

	async autenticate() {
		this.acl = new ACL(this);
		await this.acl.initialize();
	}

	async resolve() {
		let url = this.request.url;

		let ControllerCls = PageController;

		if(/^\/api\//.test(url)) {
			ControllerCls = ApiController;
		}

		this.controller = new ControllerCls(this);

		await this.controller.resolve();
	}
}