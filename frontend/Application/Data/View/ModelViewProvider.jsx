import ModelProvider from "../ModelProvider";

const findWidgetPropertyProvider = function(property, widgets) {
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

const mapToWidgetProperty = (property) => ({
	name: property.name,
	label: property.label,
	renderer: property.detailRenderer,

	__property: property,
});

export default class ModelViewProvider extends ModelProvider {
	get viewConfig() {
		if(!this.model) {
			throw new Error('You can use ModelViewProvider.viewConfig only when model is loaded');
		}

		return this.model.viewConfig;
	}

	get properties() {
		return this.model.PropertiesByScope(Scope.VIEW);
	}

	fetchWidgets(dataSource = {}) {
		let widgets = Model.ViewConfig.preparedWidgets;

		this.properties.forEach(property => {
			const provider = findWidgetPropertyProvider(property, widgets);

			if(provider) {
				provider.registerProperty(mapToWidgetProperty(property));
				provider.registerDataSource(dataSource);
			}
		});

		return Object.values(widgets);
	}

	async fetchActions(entry) {

	}

	async fetchEntry(id) {
		return await this.model.FindById(id);
	}
}