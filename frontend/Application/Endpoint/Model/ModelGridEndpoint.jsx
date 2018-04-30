import Endpoint from "../Endpoint";
import GridProvider from "../../Data/Grid/GridProvider";

export default class ModelGridEndpoint extends Endpoint {

	constructor(modelCode) {
		let gridProvider = new GridProvider(`Bundle:${modelCode}`, modelCode);

		super('Model/GridPage', { gridProvider, modelCode });
	}
}