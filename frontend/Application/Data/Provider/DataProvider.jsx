export default class DataProvider {
	/** @type {String} */
	id;
	dataSource;

	async prepare() {
		await this.dataSource.prepare();
	}

	constructor(id, dataSource) {
		this.id = id;
		this.dataSource = dataSource;
	}

	async fetchData() {
		return {};
	}
}