import Endpoint from "../Endpoint";
import ModelSource from "../../Data/Source/ModelSource";
import ViewProvider from "../../Data/Provider/Record/ViewProvider";

export default class ModelViewEndpoint extends Endpoint {

	constructor(modelCode) {
		let dataSource = new ModelSource(modelCode);
		let provider = new ViewProvider(`Bundle:${modelCode}`, dataSource);

		super('ViewPage', { provider, modelCode });
	}
}