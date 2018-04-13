export default class FrontendModel extends CommonModel {
	static async findById(id) {
		const data = await API.listEntity(this.Code, {id});

		if(data[0]) {
			return new this(data[0]);
		}

		return null;
	}

	static async search() {
		let models = await API.listEntity(this.Code);

		return models.map(data => new this(data))
	}

	constructor(data) {
		super(data);
	}

	static Layout = {};
}