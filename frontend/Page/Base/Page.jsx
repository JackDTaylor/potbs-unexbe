import Loader from "../../Common/Loader";

export default class Page extends ReactComponent {
	@prop params;

	contents = null;

	@state isReady = false;

	get pageTitle() {
		let title = '[untitled]';

		if(this.params && this.params.pageTitle) {
			title = this.params.pageTitle;
		}

		if(title instanceof Function) {
			title = title(this.params);
		}

		return title;
	}

	@asyncCatch async componentDidMount() {
		await this.preparePage();

		AppController.pageTitle = this.pageTitle;

		this.isReady = true;
	}

	async preparePage() {}

	renderContents() {
		return '';
	}

	render() {
		if(this.isReady == false) {
			return <Loader />;
		}

		return (
			<div {...this.cls}>{this.renderContents()}</div>
		);
	}
}