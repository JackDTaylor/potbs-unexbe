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

	static get SearchCriteria() {
		return ['name'];
	}

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

	static PrepareSearchCriteria(searchQuery) {
		if(!searchQuery) {
			return null;
		}

		searchQuery = `${searchQuery}`.replace(/\s+/, ' ').trim();

		if(!searchQuery) {
			return null;
		}

		let words = searchQuery.split(' ').slice(0, 16);
		let useInverted = searchQuery != searchQuery.invertKeyboardLayout();

		words = words.filter(x => x);

		if(words.length < 1) {
			return null;
		}

		return {
			columns: this.SearchCriteria,
			values: words.map(word => {
				let result = [{
					search: word,
					weight: 2
				}];

				if(useInverted) {
					result.push({
						search: word.invertKeyboardLayout(),
						weight: 1
					});
				}

				return result;
			})
		};
	}

	static async Search(params = {}, outMeta = {}) {
		params = params || {};

		params.order = params.order || { id: Order.DESC };
		params.filter = params.filter || {};
		params.search = params.search || null;

		let search = this.PrepareSearchCriteria(params.search);

		const virtualProps = this.VirtualProperties.map(p => p.name);

		let query = this.Query.search(params.filter, virtualProps);

		// Before ORDER and LIMIT, but after WHERE
		if(search) {
			query.select(search.columns.map((column, i) => ({
				[`$search_${i}`]: column}
			)));

			let wrap = x => `(${x})`;

			let bindings = {};
			let relevanceQuery = wrap(search.values.map((words, wordGroupIndex) => {
				return wrap(words.map((word, wordIndex) => {
					let valueIndex = wordGroupIndex * words.length + wordIndex;

					bindings[`search_${valueIndex}`] = `%${word.search}%`;

					return search.columns.map((column, columnIndex) => {
						const valueWeight = word.weight;
						const columnWeight = search.columns.length - columnIndex;

						// 1xxx for inverted keyboard layout, 2xxx for original typing
						// x010-x990 for columns in order they're defined in SearchCriteria

						// This way search will respect primarily a keyboard layout so inverse
						// suggestions will be always at the bottom.
						let weight = 1000 * valueWeight + 10 * columnWeight;

						return `($search_${columnIndex} LIKE :search_${valueIndex}) * ${weight}`;
					}).join(' + ');
				}).join(') + ('));
			}).join(') * ('));

			query = DB
				.select(['*', { $search_relevance: DB.raw(relevanceQuery, bindings) }])
				.from(query.withoutCalcFoundRows().as('T'))
				.withCalcFoundRows()
				.having('$search_relevance', '>', search.minRelevance || 0)
				.orderBy('$search_relevance', Order.DESC);
		}

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

		// TODO: Grouping?

		let rows = [];
		let total = 0;

		await DB.transaction(async transaction => {
			rows = await query.transacting(transaction);
			total = await DB.queryVal(`SELECT FOUND_ROWS()`, {}, transaction);
		});

		Object.assign(outMeta, {total});

		// dpr(rows);

		rows.forEach(row => {
			Object.keys(row).forEach(key => {
				if(key.slice(0, 8) == '$search_') {
					delete row[key];
				}
			})
		});

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

			if(property.writeonly) {
				delete data[key];
			}
		});

		return data;
	}
}

global.PlatformSpecificModel = BackendModel;