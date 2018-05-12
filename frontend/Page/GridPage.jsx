import FilteredGrid from "../Common/Grid/FilteredGrid";
import RecordListPage from "./Base/RecordListPage";
import GridProvider from "../Application/Data/Provider/Record/GridProvider";

export default class GridPage extends RecordListPage {
	get providerConstraint() {
		return GridProvider;
	}

	get pageTitle() {
		let name = this.provider.recordTypeName || new Noun('элемент');

		return `Список ${name.plu.gen}`;
	}

	renderContents() {
		return (
			<FilteredGrid provider={this.provider} />
		);
	}
}