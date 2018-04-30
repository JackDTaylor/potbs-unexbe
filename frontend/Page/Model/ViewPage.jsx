import ViewPage from "../ViewPage";

export default class ModelViewPage extends ViewPage {
	model;

	get pageTitle() {
		let name = this.model.Name || new Noun('элемент');

		return this.model ? `Просмотр ${name.sin.gen} #${this.params.id}` : super.pageTitle;
	}

	async preparePage() {
		this.model = await this.viewProvider.getModel();

		return super.preparePage();
	}

	shouldComponentUpdate() {
		return true;
	}
}