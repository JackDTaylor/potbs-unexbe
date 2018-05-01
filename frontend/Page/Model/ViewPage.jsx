import ViewPage from "../ViewPage";

export default class ModelViewPage extends ViewPage {
	model;

	get pageTitle() {
		let name = this.model.Name || new Noun('элемент');

		if(this.dataSource) {
			return this.dataSource.name;
		}

		return this.model ? `Просмотр ${name.sin.gen} #${this.params.id}` : super.pageTitle;
	}

	async preparePage() {
		await this.viewProvider.prepare();

		this.model = this.viewProvider.model;
		this.dataSource = await this.viewProvider.fetchEntry(this.params.id);

		if(!this.dataSource) {
			return await AppController.routeError(404);
		}

		return super.preparePage();
	}

	shouldComponentUpdate() {
		return true;
	}
}