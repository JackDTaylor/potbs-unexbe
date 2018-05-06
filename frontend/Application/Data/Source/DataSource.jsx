import Form from "../../../Common/Form/Form";
import {BasicGridIntegration} from "./Integration/BasicIntegration";

export default class DataSource {
	gridIntegration;
	formIntegration;
	viewIntegration;

	async initIntegrations() {
		this.gridIntegration = new BasicGridIntegration(this);
		this.formIntegration = new BasicFormIntegration(this);
		this.viewIntegration = new BasicViewIntegration(this);
	}

	async prepare() {
		await this.initIntegrations();
	}

	async queryRecord(id) {
		return {id};
	}

	async queryRecords(filter, order, paging) {
		return [];
	}

	get lastTotal() {
		return 0;
	}
}