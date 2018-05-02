class PropertyProvider {
	properties = {};
	dataSource = {};

	registerProperty(property) {
		this.properties[property.name] = {
			name:       property.name,
			label:      property.label,
			renderer:   property.detailRenderer,

			__property: property,
		};
	}

	registerProperties(properties) {
		properties.forEach(property => this.registerProperty(property));
	}

	registerDataSource(dataSource) {
		this.dataSource = dataSource;
	}
}

export default class BaseWidget extends ReactComponent {
	static PropertyProvider = PropertyProvider;

	@prop propertyProvider;

	render() {
		return (
			<div {...this.cls}>
				{Object.keys(this.propertyProvider.properties).join(', ')}
				BaseWidget
			</div>
		);
	}
}