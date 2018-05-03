import Endpoint from "../Endpoint";
import ModelFormProvider from "../../Data/Form/ModelFormProvider";

export default class ModelCreateEndpoint extends Endpoint {

	constructor(modelCode) {
		let viewProvider = new ModelFormProvider(`Bundle:${modelCode}:Add`, modelCode);

		super('Model/ViewPage', { viewProvider, modelCode });
	}
}