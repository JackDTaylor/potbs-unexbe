import RecordPage from "./Base/RecordPage";
import ViewLayout from "../Common/View/ViewLayout";

export default class ViewPage extends RecordPage {
	get pageTitle() {
		return this.params.pageTitle || 'Просмотр записи';
	}

	renderContents() {
		return (
			<ViewLayout provider={this.provider} record={this.record} />
		);
	}
}