import ModelProvider from "../ModelProvider";

const columnSorter = (columnOrder, alwaysFirst = [ID], alwaysLast = []) => (a, b) => {
	a = a.name;
	b = b.name;

	if(alwaysFirst.has(a) || alwaysLast.has(b) || columnOrder.has(b) == false) {
		return -1;
	}

	if(alwaysFirst.has(b) || alwaysLast.has(a) || columnOrder.has(a) == false) {
		return 1;
	}

	return columnOrder.indexOf(a) - columnOrder.indexOf(b);
};

const mapToColumn = (property) => ({
	name:       property.name,
	title:      property.label,
	renderer:   property.cellRenderer,

	hidden:     property.hidden,
	sortable:   property.queryable,
	filterable: property.queryable,

	__property: property,
});

export default class ModelGridProvider extends ModelProvider {
	_queryMeta;

	async fetchColumns() {
		let columns = this.model.PropertiesByScope(Scope.LIST).map(this.mapToColumn);

		columns.sort(columnSorter(this.model.GridConfig.columnOrder));

		return columns;
	}

	async fetchData(filter, order, paging) {
		this._queryMeta = {};

		if(empty(filter)) {
			filter = undefined;
		}

		if(empty(order)) {
			order = undefined;
		}

		if(empty(paging)) {
			paging = {};
		}

		return await this.model.Search({ filter, order, ...paging }, this._queryMeta);
	}

	get lastTotal() {
		return this._queryMeta.total || 0;
	}
}