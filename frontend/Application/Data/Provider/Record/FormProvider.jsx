import RecordProvider from "../RecordProvider";

export default class FormProvider extends RecordProvider {
	/** @protected */
	get integration() {
		return this.dataSource.formIntegration;
	}

	/** @protected */
	mapToField(property) {
		return {
			name:       property.name,
			renderer:   property.fieldRenderer,
			defaultTab: property.formDefaultTab,
			width:      property.formWidth,
			separator:  property.formSeparator,
			hidden:     property.hidden,
			property:   property,
		};
	}

	/** @protected */
	get properties() {
		return this.integration.properties.map(this.mapToField).reorder(x => x.name, this.fieldOrder);
	}

	/** @protected */
	get fieldOrder() {
		return this.integration.fieldOrder;
	}

	get tabs() {
		let tabs = {};

		this.properties.forEach(property => {
			let tab = `${property.defaultTab}`;

			if(tab in tabs == false) {
				tabs[tab] = [];
			}

			if(!property.hidden) {
				tabs[tab].push(property);
			}
		});

		return tabs;
	}

	get formComponent() {
		return this.integration.component;
	}
}