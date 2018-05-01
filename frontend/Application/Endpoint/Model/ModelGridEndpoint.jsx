import Endpoint from "../Endpoint";
import ModelGridProvider from "../../Data/Grid/ModelGridProvider";

export default class ModelGridEndpoint extends Endpoint {

	constructor(modelCode) {
		let gridProvider = new ModelGridProvider(`Bundle:${modelCode}`, modelCode);

		super('Model/GridPage', { gridProvider, modelCode });
	}
}