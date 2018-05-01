class PropertyProvider {
	properties = {};
	dataSource = {};

	registerProperty(property) {
		this.properties[property.name] = property;
	}

	registerDataSource(dataSource) {
		this.dataSource = dataSource;
	}
}

export default class BaseWidget extends ReactComponent {
	static PropertyProvider = PropertyProvider;

	render() {
		return (
			<div {...this.cls}>
				BaseWidget
			</div>
		);
	}
}