import GridProvider from "./GridProvider";

export default class ModelGridProvider extends GridProvider {
	constructor(id, modelCode) {
		super(id);
		this.modelCode = modelCode;
	}

	_queryMeta = {};

	async prepare() {
		await super.prepare();
		this.model = await GetModel(this.modelCode);
	}

	get properties() {
		return this.model.PropertiesByScope(Scope.LIST);
	}

	get columnOrder() {
		return this.model.GridConfig.columnOrder;
	}

	fetchActions() {
		return this.model.GridConfig.actions;
	}

	async queryData(filter, order, paging) {
		this._queryMeta = {};
		return await this.model.Search({ filter, order, ...paging }, this._queryMeta);
	}

	get lastTotal() {
		return this._queryMeta.total || 0;
	}
}