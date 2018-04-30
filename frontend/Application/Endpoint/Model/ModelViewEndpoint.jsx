import Endpoint from "../Endpoint";
import ViewProvider from "../../View/ViewProvider";

export default class ModelViewEndpoint extends Endpoint {

	constructor(modelCode) {
		let viewProvider = new ViewProvider(`Bundle:${modelCode}`, modelCode);

		super('Model/ViewPage', { viewProvider, modelCode });
	}
}