import DataSource from "./DataSource";

export default class ArraySource extends DataSource {
	data = [];

	constructor(data) {
		super();

		this.data = data;
	}

	async prepare() {
		this.model = await GetModel(this.modelCode);

		return await super.prepare();
	}

	async queryRecord(id) {
		return await this.model.FindById(id);
	}

	async queryRecords(filter, order, paging) {
		return await this.model.Search({ filter, order, ...paging }, this.queryRecordsMeta);
	}

	get lastTotal() {
		return this.data.length;
	}
}