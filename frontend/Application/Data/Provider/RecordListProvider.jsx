import DataProvider from "./DataProvider";

export default class RecordListProvider extends DataProvider {
	/** @protected */
	prepareFilter(filter) {
		return empty(filter) ? undefined : filter;
	}

	/** @protected */
	prepareOrder(order) {
		return empty(order) ? undefined : order;
	}

	/** @protected */
	preparePaging(paging) {
		return empty(paging) ? {} : paging;
	}

	async queryRecords(filter, order, paging) {
		return await this.dataSource.queryRecords(filter, order, paging);
	}

	async fetchRecords(filter, order, paging) {
		filter = this.prepareFilter(filter);
		order  = this.prepareOrder(order);
		paging = this.preparePaging(paging);

		return await this.queryRecords(filter, order, paging);
	}

	fetchLastTotal() {
		return this.dataSource.lastTotal;
	}
}