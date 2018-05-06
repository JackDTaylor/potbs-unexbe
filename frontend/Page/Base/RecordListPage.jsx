import ProviderPage from "./ProviderPage";
import RecordListProvider from "../../Application/Data/Provider/RecordListProvider";

export default class RecordListPage extends ProviderPage {
	get providerConstraint() {
		return RecordListProvider;
	}

	get pageTitle() {
		return `${this.record.name}`;
	}
}