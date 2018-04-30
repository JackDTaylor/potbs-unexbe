import Page from "./Page";
import FilteredGrid from "../Common/Grid/FilteredGrid";

export default class GridPage extends Page {
	get gridProvider() {
		return this.params.gridProvider;
	}

	get pageTitle() {
		return this.params.pageTitle || 'Список';
	}

	renderContents() {
		return (
			<FilteredGrid provider={this.gridProvider} />
		);
	}
}