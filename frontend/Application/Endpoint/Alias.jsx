import Endpoint from "./Endpoint";

export default class Alias extends Endpoint {
	aliasUrl;

	constructor(aliasUrl) {
		super(null);
		this.aliasUrl = aliasUrl;
	}

	async execute(params = {}) {
		await delay(25); // For cyclic redirects

		return await AppController.route(URL.withParams(this.aliasUrl, params));
	}
}