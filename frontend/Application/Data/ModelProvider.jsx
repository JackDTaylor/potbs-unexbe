import DataProvider from "./DataProvider";

export default class ModelProvider extends DataProvider {
	modelCode;
	model;

	async getModel() {
		if(!this.model) {
			this.model = await GetModel(this.modelCode);
		}

		return this.model;
	}

	constructor(id, modelCode) {
		super(id);
		this.modelCode = modelCode;
	}
}