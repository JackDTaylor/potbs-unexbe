import DataSource from "./DataSource";

export default class ArraySource extends DataSource {
	data = [];

	constructor(data = []) {
		super();

		this.data = data;
	}

	async queryRecord(id) {
		await this.prepare();

		return this.data.filter(r => r.id == id).first;
	}

	async queryRecords({search, filter, order, paging} = {}) {
		await this.prepare();

		paging = paging || { offset: 0 };

		// TODO: Implement filtering
		let filterFn = fn => true;
		let dataset = this.data.filter(filterFn);

		// TODO: Implement ordering
		// dataset.sort((a, b) => a <=> b);

		// Paging
		let offset = Math.clamp(parseInt(paging.offset) || 0, 0, Infinity);
		let count = Math.clamp(parseInt(paging.count) || 0, 0, Infinity) || 10;

		// Querying
		let totalCount = dataset.length;
		let result = dataset.slice(offset, offset + count);

		// Meta
		this.calculateQueryMeta(totalCount, offset, result.length);

		return result;
	}

	get lastTotal() {
		return this.data.length;
	}

	get nextOffset() {
		return false;
	}
}