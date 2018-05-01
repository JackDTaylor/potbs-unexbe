export default class DataProvider {
	/** @type {String} */
	id;

	async prepare() {}

	constructor(id) {
		this.id = id;
	}
}