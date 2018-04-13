export default class Endpoint {
	component;
	data;

	constructor(component, data = {}) {
		this.component = component;
		this.data = data;
	}

	async execute(params = {}) {
		let data = {
			component: `Page/${this.component}`,
			params: { ...this.data, ...params }
		};

		await AppController.content.mount(data.component, data.params);

		return data;
	}
}