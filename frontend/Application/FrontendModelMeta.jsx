import BaseWidget from "../Common/View/Widget/BaseWidget";

export default class FrontendModelMeta {
	Model;

	constructor(Model) {
		this.Model = Model;
	}
}

class GridConfig extends FrontendModelMeta {
	columnOrder = [];
	rowActions = [];

	// Row actions
	useEditRowAction = true;
	useDeleteRowAction = true;
}

class FormConfig extends FrontendModelMeta {
}

class ViewConfig extends FrontendModelMeta {
	actions = [];

	get widgets() {
		return {
			defaultWidget: BaseWidget
		};
	};

	useEditAction = true;
	useDeleteAction = false;

	get preparedWidgets() {
		const widgets = this.widgets;
		const widgetConfig = {};

		Object.keys(this.widgets).forEach(key => {
			let widget = widgets[key];

			if(valueType(widget) != Object) {
				widget = { type: widget };
			}

			widget.name = key;
			widget.propertyProvider = new BaseWidget.PropertyProvider();

			widgetConfig[key] = widget;
		});

		return widgetConfig;
	}
}

global.FrontendModelMeta = FrontendModelMeta;

/** @type {GridConfig} */
global.GridConfig = GridConfig;
/** @type {FormConfig} */
global.FormConfig = FormConfig;
/** @type {ViewConfig} */
global.ViewConfig = ViewConfig;