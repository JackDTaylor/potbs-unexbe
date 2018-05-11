import DataProvider from "./DataProvider";

export default class RecordListProvider extends DataProvider {
	/** @protected */
	prepareSearch(search) {
		return empty(search) ? undefined : `${search}`;
	}

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

	async queryRecords({search, filter, order, paging} = {}) {
		return await this.dataSource.queryRecords({search, filter, order, paging});
	}

	async fetchRecords({search, filter, order, paging} = {}) {
		search = this.prepareSearch(search);
		filter = this.prepareFilter(filter);
		order  = this.prepareOrder(order);
		paging = this.preparePaging(paging);

		return await this.queryRecords({search, filter, order, paging});
	}

	fetchLastTotal() {
		return this.dataSource.lastTotal;
	}
}