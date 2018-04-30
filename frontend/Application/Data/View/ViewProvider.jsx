import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchFields() {
		// TODO: Implement
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
		// TODO: Implement121
	}
}