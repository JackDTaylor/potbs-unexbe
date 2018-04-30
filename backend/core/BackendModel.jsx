import CommonModel from "../../common/Application/CommonModel";

/**
 * @property {Object} DatabaseProperties
 * @property {Object} CustomProperties
 * @property {Object} Options
 */
export default class BackendModel extends CommonModel {
	// Backend-only props
	// static DatabaseProperties = {};
	// static CustomProperties = {};
	// static Options = {};

	static get TableName() {
		return ModelManager.getTableName(this.Code);
	}

	static get Query() {
		const query = DB.from(this.TableName).withCalcFoundRows();

		this.Properties.filter(p => p.stored || p.expr).forEach(property => {
			if(property.expr) {
				return query.column({ [property.name]: DB.raw(property.expr) });
			}

			if(property.stored) {
				return query.column(property.name);
			}
		});

		return query;
	}

	static async FindById(id) {
		const rows = await this.Query.search({id});
		const row = rows[0];

		if(!row) {
			return null;
		}

		return new this(row);
	}

	static async Search(params = {}, outMeta = {}) {
		params = params || {};

		params.order = params.order || { id: Order.DESC };
		params.filter = params.filter || {};

		const virtualProps = this.VirtualProperties.map(p => p.name);

		let query = this.Query.search(params.filter, virtualProps);

		Object.keys(params.order).forEach(key => {
			query.orderBy(key, params.order[key]);
		});

		if(params.paging) {
			if(params.paging.count >= 0) {
				query.limit(params.paging.count);
			}

			if(params.paging.offset > 0) {
				query.offset(params.paging.offset);
			}
		}

		// TODO: Implement limits
		// TODO: Grouping?

		const rows = await query;
		const total = await DB.queryVal(`SELECT FOUND_ROWS()`);

		Object.assign(outMeta, {total});

		const rowIds = rows.map(row => row.id);
		const rowRefs = {};

		if(this.SubqueryProperties.length) {
			await DB.db.union(this.SubqueryProperties.map(property => {
				const name       = property.name;
				const through    = property.link.through;
				const foreignKey = property.link.foreignKey;
				const otherKey   = property.link.otherKey;

				return DB.from(through)
					.select({ name: DB.raw(`"${name}"`), foreignKey, otherKey })
					.search({ [foreignKey]: rowIds });
			})).forEach(ref => {
				if(ref.name in rowRefs == false) {
					rowRefs[ref.name] = {};
				}

				if(ref.foreignKey in rowRefs[ref.name] == false) {
					rowRefs[ref.name][ref.foreignKey] = [];
				}

				rowRefs[ref.name][ref.foreignKey].push(ref.otherKey)
			});
		}

		return rows.map(row => {
			Object.keys(rowRefs).forEach(key => {
				row[key] = rowRefs[key][row.id];
			});

			return new this(row);
		});
	}

	toJSON() {
		const data = super.toJSON();

		Object.keys(data).forEach(key => {
			const property = this.constructor.PropertyByName(key);

			if(property.secure) {
				delete data[key];
			}
		});

		return data;
	}
}

global.PlatformSpecificModel = BackendModel;