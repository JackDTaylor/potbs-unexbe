import RecordListProvider from "../RecordListProvider";

export default class GridProvider extends RecordListProvider {
	/** @protected */
	get integration() {
		return this.dataSource.gridIntegration;
	}

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
	get properties() {
		return this.integration.properties;
	}

	/** @protected */
	fetchActions() {
		return this.integration.actions;
	}

	/** @protected */
	get columnOrder() {
		return this.integration.columnOrder;
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
}