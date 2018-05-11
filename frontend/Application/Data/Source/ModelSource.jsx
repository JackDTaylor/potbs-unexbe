import DataSource from "./DataSource";
import {
	ModelFormIntegration, ModelGridIntegration,
	ModelViewIntegration
} from "./Integration/ModelIntegration";

export default class ModelSource extends DataSource {
	_model;
	queryRecordsMeta = {};

	constructor(modelCode) {
		super();

		this.modelCode = modelCode;
	}

	get model() {
		if(this._model == null) {
			throw new Error("You have to prepare() DataSource first");
		}

		return this._model;
	}

	set model(value) {
		this._model = value;
	}

	async initIntegrations() {
		this.gridIntegration = new ModelGridIntegration(this);
		this.formIntegration = new ModelFormIntegration(this);
		this.viewIntegration = new ModelViewIntegration(this);
	}

	async prepare() {
		if(this.isPrepared) {
			return;
		}

		this.model = await GetModel(this.modelCode);

		return await super.prepare();
	}

	async queryRecord(id) {
		await this.prepare();

		return await this.model.FindById(id);
	}

	async queryRecords({search, filter, order, paging} = {}) {
		await this.prepare();

		this.queryRecordsMeta = {};
		let result = await this.model.Search({ search, filter, order, ...paging }, this.queryRecordsMeta);

		// Meta
		let offset = paging ? Math.clamp(parseInt(paging.offset) || 0, 0, Infinity) : 0;
		this.calculateQueryMeta(this.queryRecordsMeta.total, offset, result.length);

		return result;

	}
}