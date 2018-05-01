import DataProvider from "./DataProvider";

export default class ModelProvider extends DataProvider {
	/** @type {String} */
	modelCode;

	model;

	async prepare() {
		await super.prepare();
		this.model = await GetModel(this.modelCode);
	}

	constructor(id, modelCode) {
		super(id);
		this.modelCode = modelCode;
	}
}