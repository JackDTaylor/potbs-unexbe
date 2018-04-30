import ApiModule from "../../core/ApiModule";
import ACL from "../../core/ACL";
import {API_CONFIG as apiConfig} from "../../config";

export default class EntityModule extends ApiModule {
	get endpoints() {
		return ['default'];
	}

	async defaultEndpoint() {
		const Model = await GetModel(this.request.query.model);

		return await this.resolveByMethod({
			[RequestType.POST]:   fn => this.createAction(Model),
			[RequestType.GET]:    fn => this.readAction(Model),
			[RequestType.PUT]:    fn => this.updateAction(Model),
			[RequestType.DELETE]: fn => this.deleteAction(Model),
		});
	}

	prepareOrder(Model) {
		if(this.request.query.order) {
			this.request.query.order = JSON.parse(this.request.query.order);
		}

		let order = {};

		if(notUndefinedOrNull(this.request.query.order)) {
			Object.keys(this.request.query.order).forEach(key => {
				const property = Model.PropertyByName(key);
				let value = String(this.request.query.order[key]);

				value = value.toLowerCase() == Order.DESC ? Order.DESC : Order.ASC;

				if(!property || (!property.stored && !property.expr)) {
					return;
				}

				// TODO: Check permissions

				order[key] = value;
			});
		}

		return order;
	}

	prepareFilter(Model) {
		if(this.request.query.filter) {
			this.request.query.filter = JSON.parse(this.request.query.filter);
		}

		if(this.request.query.id) {
			this.request.query.id = JSON.parse(this.request.query.id);
		}

		let filter = {};

		if(this.request.query.id) {
			filter = {id: this.request.query.id};
		} else if(notUndefinedOrNull(this.request.query.filter)) {
			Object.keys(this.request.query.filter).forEach(key => {
				const property = Model.PropertyByName(key);
				let value = this.request.query.filter[key];

				if(!property || undefinedOrNull(value)) {
					return;
				}

				// TODO: Check permissions

				if(valueType(value) == Object && Object.keys(value).length == 2) {
					if('from' in value && 'to' in value) {
						if(valueType(value.from) != Number) {
							value.from = null;
						}

						if(valueType(value.to) != Number) {
							value.to = null;
						}

						value = new Range(value.from, value.to);
					}
				}

				filter[key] = property.type.where(value);
			});
		}

		return filter;
	}

	preparePaging(Model) {
		let offset = parseInt(this.request.query.offset) || 0;
		let count =  parseInt(this.request.query.count)  || apiConfig.list.defaultCount;

		offset = Math.clamp(offset, 0, Infinity);
		count = Math.clamp(count, 0, Model.MaxListCount || apiConfig.list.maxCount);

		return {offset, count}
	}

	async readAction(Model) {
		// if(!this.request.query.id) await delay(10000);

		const order = this.prepareOrder(Model);
		const filter = this.prepareFilter(Model);
		const paging = this.preparePaging(Model);

		return await Model.Search({order,filter,paging}, this.responseMeta);
	}

	async createAction(Model) {

	}

	async updateAction(Model) {
		// dpr(await ACL.refreshColumnPermissions());

		// const AclUser = await GetModel('Acl/User');
		// const user = await AclUser.FindById(1);
		//
		// user.full_name = 'Jack Taylor';
		// await user.save();
		// await user.reload();
		// dpr(user);

		// dpr(await m.getIngredients().map(n=>n.toJSON()));

		return {
			body: this.request.body,
			query: this.request.query,
		}
	}

	async deleteAction(Model) {

	}
}