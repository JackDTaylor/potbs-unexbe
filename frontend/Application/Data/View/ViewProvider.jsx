import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchFields() {
		// TODO: Implement this function2
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}