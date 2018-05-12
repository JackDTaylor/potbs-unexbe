import ProviderPage from "./ProviderPage";
import RecordProvider from "../../Application/Data/Provider/RecordProvider";

export default class RecordPage extends ProviderPage {
	get providerConstraint() {
		return RecordProvider;
	}

	record = {};

	async preparePage() {
		await super.preparePage();

		this.record = await this.provider.fetchRecord(this.params.id);

		if(!this.record) {
			return await AppController.routeError(404);
		}
	}

	get pageTitle() {
		return `${this.record.name}`;
	}
}