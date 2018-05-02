import ViewProvider from "./ViewProvider";

export default class ModelViewProvider extends ViewProvider {
	constructor(id, modelCode) {
		super(id);
		this.modelCode = modelCode;
	}

	async prepare() {
		await super.prepare();

		this.model = await GetModel(this.modelCode);
	}

	get properties() {
		return this.model.PropertiesByScope(Scope.VIEW);
	}

	get widgets() {
		return this.model.ViewConfig.preparedWidgets;
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}