import Page from "./Page";

export default class ViewPage extends Page {
	get viewProvider() {
		return this.params.viewProvider;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Просмотр записи';
	}

	renderContents() {
		return (
			<b>view page</b>
			/*<FilteredGrid provider={this.gridProvider} />*/
		);
	}
}