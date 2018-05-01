import Endpoint from "../Endpoint";
import ModelViewProvider from "../../Data/View/ModelViewProvider";

export default class ModelViewEndpoint extends Endpoint {

	constructor(modelCode) {
		let viewProvider = new ModelViewProvider(`Bundle:${modelCode}`, modelCode);

		super('Model/ViewPage', { viewProvider, modelCode });
	}
}