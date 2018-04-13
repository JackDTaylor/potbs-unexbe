import Page from "./Page";

export default class FormPage extends Page {
	get cssClass() { return [...super.cssClass, 'FormPage'] };

	fields;
	defaults;

	get proxy() {
		return this.params.proxy;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Форма';
	}

	async getDefaults() {
		return {};
	}

	async preparePage() {
		this.fields = await this.proxy.fetchFields();
		this.defaults = await this.getDefaults();

		return await super.preparePage();
	}

	renderContents() {
		return (
			<b>Form {JSON.stringify(this.fields)}</b>
		);
	}
}