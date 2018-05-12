import Endpoint from "../Endpoint";
import ModelSource from "../../Data/Source/ModelSource";
import FormProvider from "../../Data/Provider/Record/FormProvider";

export default class ModelEditEndpoint extends Endpoint {
	constructor(modelCode) {
		let dataSource = new ModelSource(modelCode);
		let provider = new FormProvider(`Bundle:${modelCode}:Edit`, dataSource);

		super('FormPage', { provider, modelCode, createNew: false });
	}
}