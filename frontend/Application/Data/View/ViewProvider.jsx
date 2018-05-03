import DataProvider from "../DataProvider";

export default class ViewProvider extends DataProvider {
	get properties() {
		return [];
	}

	get widgets() {
		return [];
	}

	get actions() {
		return [];
	}

	get columnWidths() {
		return [];
	}

	/**
	 * Fetches the widgets
	 * @param dataSource
	 * @return {Array}
	 */
	fetchWidgets(dataSource = {}) {
		return this.widgets.map(widget => {
			const widgetProperties = this.properties.filter(p => p.widget == widget.name);

			widget.propertyProvider.registerDataSource(dataSource);
			widget.propertyProvider.registerProperties(widgetProperties);

			return widget;
		});
	}

	/**
	 * Fetches the actions
	 * @param dataSource
	 * @return {Array}
	 */
	fetchActions(dataSource = {}) {
		return this.actions;
	}

	/**
	 * Fetches the column widths
	 * @param dataSource
	 * @return {[number,number,number]}
	 */
	fetchColumnWidths(dataSource = {}) {
		return this.columnWidths;
	}
}