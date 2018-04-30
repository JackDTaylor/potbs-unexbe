import KnexQueryBuilder from "knex/lib/query/builder";

const DbOperations = {
	gt:        (b, c) => b[ c.where + ``        ](c.name, '>', c.value),
	lt:        (b, c) => b[ c.where + ``        ](c.name, '<', c.value),
	gtEq:      (b, c) => b[ c.where + ``        ](c.name, '>=', c.value),
	ltEq:      (b, c) => b[ c.where + ``        ](c.name, '<=', c.value),

	eq:        (b, c) => b[ c.where + ``        ](c.name, '=', c.value),
	notEq:     (b, c) => b[ c.where + `Not`     ](c.name, '=', c.value),

	like:      (b, c) => b[ c.where + ``        ](c.name, 'like', c.value),
	notLike:   (b, c) => b[ c.where + `Not`     ](c.name, 'like', c.value),

	regexp:    (b, c) => b[ c.where + ``        ](c.name, 'regexp', c.value),
	notRegexp: (b, c) => b[ c.where + `Not`     ](c.name, 'regexp', c.value),

	in:        (b, c) => b[ c.where + `In`      ](c.name, c.value),
	notIn:     (b, c) => b[ c.where + `NotIn`   ](c.name, c.value),
	null:      (b, c) => b[ c.where + `Null`    ](c.name),
	notNull:   (b, c) => b[ c.where + `NotNull` ](c.name),
};

global.$anythingOf = true;

const proxyArrayFn = function(fnName) {
	return function(Cls) {
		Cls.prototype[fnName] = async function() {
			let rows = await this;
			return rows[fnName].apply(rows, arguments);
		};

		return Cls;
	}
};

@proxyArrayFn('reduce')
@proxyArrayFn('map')
@proxyArrayFn('reduceRight')
@proxyArrayFn('indexOf')
@proxyArrayFn('lastIndexOf')
@proxyArrayFn('every')
@proxyArrayFn('filter')
@proxyArrayFn('forEach')
@proxyArrayFn('some')
export default class QueryBuilder extends KnexQueryBuilder {
	_sqlCalcFoundRows = false;

	static create(original) {
		return new this(original.client);
	}

	clone() {
		let clone = super.clone(...arguments);

		clone._sqlCalcFoundRows = this._sqlCalcFoundRows;

		return clone;
	}

	constructor(client) {
		super(client);
	}

	assemble() {
		return this.toSQL().toNative();
	}

	get compiled() {
		return this.assemble();
	}

	withCalcFoundRows() {
		this._sqlCalcFoundRows = true;
		return this;
	}

	search(conditions, havingColumns = []) {
		let orMode = false;

		if('$anythingOf' in conditions) {
			orMode = true;

			delete conditions.$anythingOf;
		}

		Object.keys(conditions).forEach(key => {
			let name = key;
			let value = conditions[key];

			let where = havingColumns.has(key) ? 'having' : 'where';
			let orWhere = havingColumns.has(key) ? 'orHaving' : 'orWhere';

			let whereFn = orMode ? orWhere : where;

			if(value instanceof Range) {
				let range = value;
				value = b => b[where](key, '>=', range.from)[where](key, '<', range.to);
			}

			if(value instanceof RegExp) {
				value = {regexp:value.source}
			}

			if(valueType(value) == Array) {
				value = {in:value};
			}

			if(valueType(value) == Object) {
				let op = Object.keys(value)[0];

				if(op in DbOperations) {
					return DbOperations[op](this, { name, value: value[op], where: whereFn });
				}

				let subCond = value;
				value = b => b.search(subCond, havingColumns);
			}

			if(valueType(value) == Function) {
				value.apply(this, [this]);

				return this;
			}

			return this[where](name, '=', value);
		});

		return this;
	}
}