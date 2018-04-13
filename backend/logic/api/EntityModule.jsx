import ApiModule from "../../core/ApiModule";
import Application from "../../core/Application";
import Lang from "../../core/Lang";
import ACL from "../../core/ACL";

export default class EntityModule extends ApiModule {
	get endpoints() {
		return ['default'];
	}

	async defaultEndpoint() {
		const Model = await Application.GetModel(this.request.query.model);

		return await this.resolveByMethod({
			[RequestType.POST]:   fn => this.createAction(Model),
			[RequestType.GET]:    fn => this.readAction(Model),
			[RequestType.PUT]:    fn => this.updateAction(Model),
			[RequestType.DELETE]: fn => this.deleteAction(Model),
		});
	}

	async createAction(Model) {

	}

	async readAction(Model) {
		// dpr(await ACL.refreshColumnPermissions());

		// const AclUser = await Application.GetModel('Acl/User');
		// const user = await AclUser.findById(1);
		//
		// user.full_name = 'Jack Taylor';
		// await user.save();
		// await user.reload();
		// dpr(user);

		// dpr(await m.getIngredients().map(n=>n.toJSON()));

		let search = {...this.request.query.filter};

		if(this.request.query.id) {
			search = {id: this.request.query.id};
		}

		const result = await Model.search(search);

		return await result.mapAsync(async item => {
			const m2mProperties = {};

			await Object.values(Model.links).forEachAsync(async link => {
				if(link.type == Link.M2M && link.fullKey in Model.associations) {
					const method = Model.associations[link.fullKey].accessors.get;
					const reference = await item[method]();

					console.log(reference.map(m => m.id));

					m2mProperties[link.idKey] = reference.map(m => m.id);
				}
			});

			return {
				...item.toJSON(),
				...m2mProperties,
			}
		});
	}

	async updateAction(Model) {
		return {
			body: this.request.body,
			query: this.request.query,
		}
	}

	async deleteAction(Model) {

	}
}