import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchFields() {
		throw new Error('Not implemented yet');
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}