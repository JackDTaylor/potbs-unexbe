import FormPage from "../FormPage";

export default class EditFormPage extends FormPage {
	model;
	dataSource = {};

	get pageTitle() {
		let name = this.model.Name || new Noun('элемент');

		if(this.dataSource) {
			return `${this.dataSource.name} - редактирование`;
		}

		return this.model ? `Редактирование ${name.gen} #${this.params.id}` : super.pageTitle;
	}

	async preparePage() {
		await this.formProvider.prepare();

		this.model = this.formProvider.model;
		this.dataSource = await this.formProvider.fetchEntry(this.params.id);

		if(!this.dataSource) {
			return await AppController.routeError(404);
		}

		return super.preparePage();
	}

	shouldComponentUpdate() {
		return true;
	}
}