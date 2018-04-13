import Endpoint from "./Endpoint";

export default class Redirect extends Endpoint {
	redirectUrl;

	constructor(redirectUrl) {
		super(null);
		this.redirectUrl = redirectUrl;
	}

	async execute(params = {}) {
		return await AppController.redirect(this.redirectUrl, params.context || null);
	}
}