import FormPage from "../FormPage";

export default class ModelEditFormPage extends FormPage {
	model;

	get pageTitle() {
		// let name = this.model.Name || new Noun('элемент');

		// return this.model ? `Редактирование ${name.sin.gen}` : super.pageTitle;
	}

	async getDefaults() {
		// const entry = this.model.FindById(2);
		// console.log(entry);
		// window.eee = entry;
		// return entry;
	}

	async preparePage() {
		// this.model = await this.proxy.model;

		await super.preparePage();

		const formName = this.params.formName || 'default';
		// await this.prepareFormConfig();
	}

	// async prepareFormConfig(formName = 'Default') {
	// 	const formConfig = this.model.forms
	// 		? this.model.forms[formName] || this.model.forms.Default || {}
	// 		: {};
	//
	// 	const fieldObjects = {};
	// 	this.fields.forEach(field => fieldObjects[field.name] = field);
	//
	// 	if(formConfig.exclude) {
	// 		if(formConfig.exclude.has('*') == false) {
	// 			formConfig.exclude.forEach(excluded => {
	// 				this.fields = this.fields.filter(f => f.name != excluded);
	// 			});
	// 		} else {
	// 			// Try to remove everything except "included"
	// 			const fieldsToKeep = formConfig.include.map(f => f.name) || [];
	//
	// 			this.fields = this.fields.filter(f => fieldsToKeep.has(f.name));
	// 		}
	// 	}
	//
	// 	if(formConfig.extend) {
	// 		Object.keys(formConfig.extend).forEach(extended => {
	// 			const extend = formConfig.extend[extended];
	//
	// 			this.fields = this.fields.map(field => {
	// 				if(field.name == extended) {
	// 					field = { ...field, ...extend };
	// 				}
	//
	// 				return field;
	// 			});
	// 		});
	// 	}
	//
	// 	if(formConfig.include) {
	// 		formConfig.include = formConfig.include.filter(i => {
	// 			return this.fields.some(a => a.name = i.name) == false;
	// 		});
	//
	// 		formConfig.include.forEach(included => {
	// 			this.fields = this.fields.filter(f => f.name != included);
	// 		});
	//
	// 		this.fields = this.fields.concat(formConfig.include);
	// 	}
	//
	// 	if(formConfig.arrange) {
	// 		formConfig.arrange.forEach((displayGroup, dgId) => {
	// 			displayGroup.forEach((field, sortIndex) => {
	// 				if(field in fieldObjects) {
	// 					fieldObjects[field].sortIndex = sortIndex;
	// 					fieldObjects[field].displayGroup = dgId;
	// 				} else {
	// 					console.warn(`Arranged field ${field} not in field list`);
	// 				}
	// 			});
	// 		});
	//
	// 		// this.fields.forEach(field => {
	// 		// 	field.sortIndex = field.sortIndex || 1024;
	// 		// 	field.displayGroup = field.displayGroup || 1024;
	// 		// });
	//
	// 		this.fields.sort((a, b) => {
	// 			if(a.displayGroup == b.displayGroup) {
	// 				return a.sortIndex - b.sortIndex;
	// 			}
	//
	// 			return a.displayGroup - b.displayGroup;
	// 		});
	// 	}
	// }

	shouldComponentUpdate() {
		return true;
	}
}