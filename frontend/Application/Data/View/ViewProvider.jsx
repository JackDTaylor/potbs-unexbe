import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchProperties() {
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}