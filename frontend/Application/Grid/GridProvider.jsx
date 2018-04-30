export default class GridProvider {
	id;
	modelCode;
	model;

	_queryMeta;

	async getModel() {
		if(!this.model) {
			this.model = await GetModel(this.modelCode);
		}

		return this.model;
	}

	constructor(id, modelCode) {
		this.id = id;
		this.modelCode = modelCode;
	}

	get gridConfig() {
		if(!this.model) {
			throw new Error('You can use GridProvider.gridConfig only when model is loaded');
		}

		return this.model.GridConfig;
	}

	applyCustomColumnOrder(columns) {
		const alwaysFirst = [ID];
		const alwaysLast = [];

		const columnOrder = this.gridConfig.columnOrder;

		if(columnOrder) {
			columns.sort((a, b) => {
				a = a.name;
				b = b.name;

				if(alwaysFirst.has(a) || alwaysLast.has(b) || columnOrder.has(b) == false) {
					return -1;
				}

				if(alwaysFirst.has(b) || alwaysLast.has(a) || columnOrder.has(a) == false) {
					return 1;
				}

				return columnOrder.indexOf(a) - columnOrder.indexOf(b);
			});
		}

		return columns;
	}

	async fetchColumns() {
		const Model = await this.getModel();

		const properties = Model.PropertiesByScope(Scope.LIST);

		let columns = properties.map(property => ({
			name:     property.name,
			title:    property.label,
			property: property,
		}));

		columns = this.applyCustomColumnOrder(columns);

		return columns;
	}

	async fetchData(filter, order, paging) {
		if(filter && Object.keys(filter).length < 1) {
			filter = undefined;
		}

		if(order && Object.keys(order).length < 1) {
			order = undefined;
		}

		const Model = await this.getModel();

		this._queryMeta = {};
		return await Model.Search({ filter, order, ...paging }, this._queryMeta);
	}

	get lastTotal() {
		return this._queryMeta.total;
	}
}