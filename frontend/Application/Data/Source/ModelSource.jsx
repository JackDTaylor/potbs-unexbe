import DataSource from "./DataSource";
import {
	ModelFormIntegration, ModelGridIntegration,
	ModelViewIntegration
} from "./Integration/ModelIntegration";

export default class ModelSource extends DataSource {
	model;
	queryRecordsMeta = {};

	constructor(modelCode) {
		super();

		this.modelCode = modelCode;
	}

	async initIntegrations() {
		this.gridIntegration = new ModelGridIntegration(this);
		this.formIntegration = new ModelFormIntegration(this);
		this.viewIntegration = new ModelViewIntegration(this);
	}

	async prepare() {
		this.model = await GetModel(this.modelCode);

		return await super.prepare();
	}

	async queryRecord(id) {
		return await this.model.FindById(id);
	}

	async queryRecords(filter, order, paging) {
		this.queryRecordsMeta = {};
		return await this.model.Search({ filter, order, ...paging }, this.queryRecordsMeta);
	}

	get lastTotal() {
		return this.queryRecordsMeta.total;
	}
}