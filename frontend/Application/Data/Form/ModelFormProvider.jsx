import FormProvider from "./FormProvider";

export default class ModelFormProvider extends FormProvider {
	constructor(id, modelCode) {
		super(id);
		this.modelCode = modelCode;
	}

	async prepare() {
		await super.prepare();

		this.model = await GetModel(this.modelCode);
	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}