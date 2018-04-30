import GridPage from "../GridPage";
let mountTimes = 0;

export default class ModelGridPage extends GridPage {
	model;

	get pageTitle() {
		let name = this.model.Name || new Noun('элемент');
		return this.model ? `Список ${name.plu.gen}` : super.pageTitle;
	}

	async componentDidMount() {
		mountTimes += 1;
		return super.componentDidMount();
	}

	async preparePage() {
		this.model = await this.gridProvider.getModel();

		return super.preparePage();
	}
}