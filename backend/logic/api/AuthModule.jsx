import ApiModule from "../../core/ApiModule";

export default class AuthModule extends ApiModule {
	get endpoints() {
		return ['getUser', 'login'];
	}

	getUserEndpoint() {
		return this.user;
	}
}