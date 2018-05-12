import WidgetProperties from "../View/WidgetProperties";

class PropertyProvider {
	properties = {};
	record = {};

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

	registerRecord(record) {
		this.record = record;
	}

	renderValue(name) {
		if(name in this.properties == false) {
			return '';
		}

		const property = this.properties[name];
		const value = this.record[name];

		let Renderer = property.renderer;

		if(Renderer == CellRenderers.RowLinkCell) {
			Renderer = CellRenderers.DefaultCell;
		}

		return RenderComponent({
			type: GetRenderer(Renderer),
			className: 'dmi-widget-property-value',
			record: this.record,
			property: property,
			value: value
		});
	}
}

export default class BaseWidget extends ReactComponent {
	static PropertyProvider = PropertyProvider;

	@prop propertyProvider;
	@prop record;

	render() {
		return (
			<div {...this.cls}>
				<WidgetProperties provider={this.propertyProvider} />
			</div>
		);
	}
}