import RecordProvider from "../RecordProvider";

export default class ViewProvider extends RecordProvider {
	get integration() {
		return this.dataSource.viewIntegration;
	}

	get properties() {
		return this.integration.properties;
	}

	get widgets() {
		return this.integration.widgets;
	}

	get actions() {
		return this.integration.actions;
	}

	get columnWidths() {
		return this.integration.columnWidths;
	}

	/**
	 * Fetches the widgets
	 * @param record
	 * @return {Array}
	 */
	fetchWidgets(record = {}) {
		return this.widgets.map(widget => {
			const widgetProperties = this.properties.filter(p => p.widget == widget.name);

			widget.propertyProvider.registerRecord(record);
			widget.propertyProvider.registerProperties(widgetProperties);

			return widget;
		});
	}

	/**
	 * Fetches the actions
	 * @param record
	 * @return {Array}
	 */
	fetchActions(record = {}) {
		return this.actions;
	}

	/**
	 * Fetches the column widths
	 * @param record
	 * @return {number[]}
	 */
	fetchColumnWidths(record = {}) {
		return this.columnWidths;
	}
}