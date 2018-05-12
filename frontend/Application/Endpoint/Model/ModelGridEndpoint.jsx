import Endpoint from "../Endpoint";
import ModelSource from "../../Data/Source/ModelSource";
import GridProvider from "../../Data/Provider/Record/GridProvider";

export default class ModelGridEndpoint extends Endpoint {

	constructor(modelCode) {
		let dataSource = new ModelSource(modelCode);
		let provider = new GridProvider(`Bundle:${modelCode}`, dataSource);

		super('GridPage', { provider, modelCode });
	}
}