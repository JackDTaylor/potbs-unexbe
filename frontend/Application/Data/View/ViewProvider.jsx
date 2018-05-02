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

	/** @protected */
	findWidgetPropertyProvider(property, widgets) {
		if(!property.widget) {
			return null;
		}

		if(widgets[property.widget]) {
			return widgets[property.widget].propertyProvider;
		}

		console.warn(`Unknown widget '${property.widget}' for property '${property.name}'`);

		if(widgets.defaultWidget) {
			return widgets.defaultWidget.propertyProvider;
		}

		console.warn(`No defaultWidget was found, skipping '${property.name}'`);
		return null;
	};

	/** @protected */
	mapToWidgetProperty(property) {
		return {
			name: property.name,
			label: property.label,
			renderer: property.detailRenderer,

			__property: property,
		};
	}

	/**
	 * Fetches the widgets
	 * @param dataSource
	 * @return {Array}
	 */
	fetchWidgets(dataSource = {}) {
		let widgets = this.widgets;

		this.properties.forEach(property => {
			const provider = this.findWidgetPropertyProvider(property, widgets);

			if(provider) {
				provider.registerProperty(this.mapToWidgetProperty(property));
				provider.registerDataSource(dataSource);
			}
		});

		return Object.values(widgets);
	}

	/**
	 * Fetches the actions
	 * @param dataSource
	 * @return {Array}
	 */
	fetchActions(dataSource = {}) {
		// TODO
	}
}