import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchFields() {
		// TODO: Implement this
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}