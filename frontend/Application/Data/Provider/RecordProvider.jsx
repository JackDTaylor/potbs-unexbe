import DataProvider from "./DataProvider";

export default class RecordProvider extends DataProvider {
	async fetchRecord(id) {
		return await this.dataSource.queryRecord(id);
	}
}