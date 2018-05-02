import BaseWidget from "../Common/View/Widget/BaseWidget";
import Action from "../Common/Action/Action";
import DeleteAction from "../Common/Action/DeleteAction";
import EditAction from "../Common/Action/EditAction";

export default class FrontendModelMeta {
	Model;

	constructor(Model) {
		if(!Model) {
			throw new Error('No model reference profided into FrontendModelMeta constructor');
		}

		this.Model = Model;
	}

	get GridConfig() {
		return this.Model.GridConfig;
	}

	get FormConfig() {
		return this.Model.FormConfig;
	}

	get ViewConfig() {
		return this.Model.ViewConfig;
	}

	// Available actions
	hideEditAction = false;
	hideDeleteAction = false;

	get actions() {
		let actions = [];

		if(this.hideEditAction == false) {
			actions.push(p => <EditAction {...p}
				label={`Изменить ${this.Model.Name.acc}`}
				onExecute={p.target.editUrl}
			/>);
		}

		if(this.hideDeleteAction == false) {
			actions.push(p => <DeleteAction {...p}
				label={`Удалить ${this.Model.Name.acc}`}
				onExecute={fn => console.log(this.Model.Code + '.DeleteAction', p)}
			/>);
		}

		return actions;
	}
}

class GridConfig extends FrontendModelMeta {
	columnOrder = [];
}

class FormConfig extends FrontendModelMeta {
}

class ViewConfig extends FrontendModelMeta {
	hideDeleteAction = true;

	get widgets() {
		return class {
			@widget(BaseWidget) defaultWidget;
		};
	};

	get preparedWidgets() {
		const widgetCollection = this.widgets;
		const widgets = new widgetCollection;
		const widgetConfig = {};

		widgetCollection.WidgetNames.forEach(key => {
			let widget = widgets[key];

			if(valueType(widget) != Object) {
				widget = { type: widget };
			}

			widget.name = key;
			widget.propertyProvider = new BaseWidget.PropertyProvider();

			widgetConfig[key] = widget;
		});

		return Object.values(widgetConfig);
	}
}

global.FrontendModelMeta = FrontendModelMeta;

/** @type {GridConfig} */
global.GridConfig = GridConfig;
/** @type {FormConfig} */
global.FormConfig = FormConfig;
/** @type {ViewConfig} */
global.ViewConfig = ViewConfig;