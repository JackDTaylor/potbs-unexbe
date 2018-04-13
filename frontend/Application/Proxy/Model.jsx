import EndpointProxy from "../Endpoint/EndpointProxy";
import API from "../API";

export default class ModelProxy extends EndpointProxy {
	modelName;

	constructor(modelName) {
		super(`/api/entity?model=${modelName}`);

		this.modelName = modelName;
	}

	get model() {
		if(!this._model) {
			this._model = GetModel(this.modelName);
		}

		return this._model;
	}

	async fetchLayout(scope = false) {
		return Object.values(await API.entityLayout(this.modelName, scope));
	}

	async fetchListColumns() {
		const Model = (await this.model);
		let columns = Model.Columns(Scope.LIST).map(({name, label, type}) => ({name, title: label, type}));
		let columnOrder = Model.ListColumnOrder;

		if(columnOrder) {
			columns.sort((a, b) => {
				a = a.name;
				b = b.name;

				if(columnOrder.has(b) == false) {
					return -1;
				}

				if(columnOrder.has(a) == false) {
					return 1;
				}

				console.log(a, b);
				return columnOrder.indexOf(a) - columnOrder.indexOf(b);
			});
		}

		return columns;
	}

	async fetchFields() {
		const columns = await this.fetchLayout('form');
		return columns.map(({name, label, type}) => ({name, label, type}));
	}

	async fetchListData() {
		const Model = await this.model;

		return await Model.search();
	}
}