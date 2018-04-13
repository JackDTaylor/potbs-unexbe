import ListPage from "../ListPage";
let mountTimes = 0;
export default class ModelListPage extends ListPage {
	get cssClass() { return [...super.cssClass, 'ModelListPage'] };

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
		this.model = await this.proxy.model;

		return super.preparePage();
	}

	shouldComponentUpdate() {
		return true;
	}
}