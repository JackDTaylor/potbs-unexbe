import Page from "./Page";

export default class FormPage extends Page {
	fields;
	defaults;

	get formProvider() {
		return this.params.formProvider;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Форма';
	}

	async getDefaults() {
		return {};
	}

	async preparePage() {
		// this.fields = await this.formProvider.fetchFields();
		// this.defaults = await this.getDefaults();

		return await super.preparePage();
	}

	renderContents() {
		return (
			<b>Form {JSON.stringify(this.fields)}</b>
		);
	}
}