import DataProvider from "../DataProvider";

export default class GridProvider extends DataProvider {
	/** @protected */
	mapToColumn(property) {
		return {
			name:       property.name,
			title:      property.label,
			renderer:   property.cellRenderer,

			hidden:     property.hidden,
			sortable:   property.queryable,
			filterable: property.queryable,

			__property: property,
		};
	}

	/** @protected */
	prepareFilter(filter) {
		return empty(filter) ? undefined : filter;
	}

	/** @protected */
	prepareOrder(order) {
		return empty(order) ? undefined : order;
	}

	/** @protected */
	preparePaging(paging) {
		return empty(paging) ? {} : paging;
	}

	/** @protected */
	get properties() {
		return [];
	}

	/** @protected */
	get columns() {
		return this.properties.map(p => this.mapToColumn(p));
	}

	prepareColumns(columns) {
		return columns.reorder(x => x.name, this.columnOrder, [ID], []);
	}

	fetchColumns() {
		return this.prepareColumns(this.columns);
	}

	fetchActions() {
		return [];
	}

	async queryData(filter, order, paging) {
		return [];
	}

	async fetchData(filter, order, paging) {
		filter = this.prepareFilter(filter);
		order  = this.prepareOrder(order);
		paging = this.preparePaging(paging);

		return await this.queryData(filter, order, paging);
	}

	get lastTotal() {
		return 0;
	}
}