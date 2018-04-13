import ApiModule from "../../core/ApiModule";

export default class FrontendModule extends ApiModule {
	get endpoints() {
		return ['default'];
	}

	async defaultEndpoint() {
		return {
			// customIcons,
		}
	}
}