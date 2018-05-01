import ModelProvider from "../ModelProvider";

export default class ViewProvider extends ModelProvider {
	async fetchFields() {
		// TODO: Implement122324
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
		// TODO: Implement2224234
	}
}