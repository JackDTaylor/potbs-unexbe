import Page from "./Page";
import FilteredGrid from "../Common/List/FilteredGrid";

export default class ListPage extends Page {
	get cssClass() { return [...super.cssClass, 'ListPage'] };

	get proxy() {
		return this.params.proxy;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Список';
	}

	renderContents() {
		return (
			<FilteredGrid proxy={this.proxy} />
		);
	}
}