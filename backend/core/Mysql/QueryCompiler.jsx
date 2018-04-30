import KnexQueryCompiler from "knex/lib/query/compiler";

export default class QueryCompiler extends KnexQueryCompiler {
	constructor(client, builder) {
		super(client, builder);
	}

	columns() {
		let result = super.columns(...arguments);

		if(result && this.formatter.builder._sqlCalcFoundRows) {
			result = result.replace(/^select/, 'select sql_calc_found_rows');
		}

		return result;
	}
}