export default class CommonModel {
	constructor(data) {
		Object.keys(data).forEach(key => {
			this[key] = data[key];
		});
	}

	static Columns(scope = Scope.ALL) {
		return Object.values(this.Layout).filter(column => column.scope & scope);
	}
}