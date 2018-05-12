import {
	BasicFormIntegration, BasicGridIntegration,
	BasicViewIntegration
} from "./Integration/BasicIntegration";

export default class DataSource {
	isPrepared = false;

	_nextOffset = false;
	_lastTotal = 0;

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

		this.isPrepared = true;
	}

	async queryRecord(id) {
		await this.prepare();

		return {id};
	}

	async queryRecords({search, filter, order, paging} = {}) {
		await this.prepare();

		return [];
	}

	calculateQueryMeta(totalCount, offset, count) {
		this._lastTotal = totalCount;

		offset = offset || 0;
		count  = count || this.lastTotal;

		if(offset + count >= this.lastTotal) {
			this._nextOffset = false;
		} else {
			this._nextOffset = offset + count;
		}
	}

	get lastTotal() {
		return this._lastTotal;
	}

	get nextOffset() {
		return this._nextOffset;
	}
}