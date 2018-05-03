import Endpoint from "../Endpoint";
import ModelFormProvider from "../../Data/Form/ModelFormProvider";

export default class ModelEditEndpoint extends Endpoint {
	constructor(modelCode) {
		let formProvider = new ModelFormProvider(`Bundle:${modelCode}:Edit`, modelCode);

		super('Model/EditPage', { formProvider, modelCode });
	}
}