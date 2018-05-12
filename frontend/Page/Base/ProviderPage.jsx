import Page from "./Page";
import DataProvider from "../../Application/Data/Provider/DataProvider";

export default class ProviderPage extends Page {
	get providerConstraint() {
		return DataProvider;
	}

	async preparePage() {
		await this.provider.prepare();
	}

	get provider() {
		return this.params.provider;
	}
}