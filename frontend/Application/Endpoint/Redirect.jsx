import Endpoint from "./Endpoint";

export default class Redirect extends Endpoint {
	redirectUrl;

	constructor(redirectUrl) {
		super(null);
		this.redirectUrl = redirectUrl;
	}

	async execute(params = {}) {
		await delay(25); // For cyclic redirects

		return await AppController.redirect(URL.withParams(this.redirectUrl, params));
	}
}