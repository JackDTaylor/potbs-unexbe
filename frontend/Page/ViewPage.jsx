import Page from "./Page";
import ViewLayout from "../Common/View/ViewLayout";

export default class ViewPage extends Page {
	dataSource = {};

	get viewProvider() {
		return this.params.viewProvider;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Просмотр записи';
	}

	renderContents() {
		return (
			<ViewLayout provider={this.viewProvider} dataSource={this.dataSource} />
		);
	}
}