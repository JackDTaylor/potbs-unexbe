import ModelForm from "../../../../Common/Form/ModelForm";
import {BasicFormIntegration, BasicGridIntegration, BasicViewIntegration} from "./BasicIntegration";

/**
 * Data source integration for model-specific grid pages
 */
export class ModelGridIntegration extends BasicGridIntegration {
	get model() {
		return this.dataSource.model;
	}

	get properties() {
		return this.model.PropertiesByScope(Scope.LIST);
	}

	get actions() {
		return this.model.GridConfig.actions;
	}

	get columnOrder() {
		return this.model.GridConfig.columnOrder;
	}
}

/**
 * Data source integration for model-specific form pages
 * @class
 */
export class ModelFormIntegration extends BasicFormIntegration {
	get model() {
		return this.dataSource.model;
	}

	get component() {
		return ModelForm;
	}
}

/**
 * Data source integration for model-specific view pages
 * @class
 */
export class ModelViewIntegration extends BasicViewIntegration {
	get model() {
		return this.dataSource.model;
	}

	get properties() {
		return this.model.PropertiesByScope(Scope.VIEW);
	}

	get widgets() {
		return this.model.ViewConfig.preparedWidgets;
	}

	get actions() {
		return this.model.ViewConfig.actions;
	}

	get columnWidths() {
		return this.model.ViewConfig.columnWidths || super.columnWidths;
	}
}

