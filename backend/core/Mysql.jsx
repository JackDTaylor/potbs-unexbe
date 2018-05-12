import {DB_CONFIG} from "../config";
import Knex from "knex";
import QueryBuilder from "./Mysql/QueryBuilder";
import QueryCompiler from "./Mysql/QueryCompiler";

import "./Managers/ModelManager";

let generateBuilderFn = client => fn => new QueryBuilder(client);
let generateCompilerFn = client => builder => new QueryCompiler(client, builder);

let attachWorkers = (target) => {
	let client = target.client || DB.db.client;

	target.queryBuilder = generateBuilderFn(client);
	target.queryCompiler = generateCompilerFn(client);

	target.client.queryBuilder = generateBuilderFn(client);
	target.client.queryCompiler = generateCompilerFn(client);
};

/** @type {Mysql} */
let instance = null;

export default class Mysql {
	/** @return {Mysql} */
	static get Instance() {
		if(!instance) {
			throw new Error("Database connection is not established yet");
		}

		return instance;
	}

	db = null;

	static async Initialize() {
		instance = new Mysql(DB_CONFIG);

		await ModelManager.prepare();
	}

	constructor(config) {
		this.db = Knex({...config });

		attachWorkers(this.db);
	}

	getModelBundleUrls() {

	}

	get connectionSettings() {
		return this.db.client.connectionSettings;
	}

	get from() {
		return this.db;
	}

	get select() {
		return this.db.select;
	}

	raw() {
		return this.db.raw(...arguments);
	}

	get NULL() {
		return this.raw('null');
	}

	escape(value) {
		const type = valueType(value);

		if(type == Number) {
			return value + '';
		}

		if(type == String) {
			return `${value}`.replace(/%/g, `\\%`);
		}

		return value;
	}

	fromSchema(table, options) {
		return this.db(table, options).withSchema('information_schema');
	}


	async query(sql, options = {}, transaction = null) {
		let query = this.db.raw(sql, options);

		if(transaction) {
			query.transacting(transaction);
		}

		let response = (await query)[0];

		if(valueType(response) == Array) {
			return response.map(row => ({...row}));
		}

		return response;
	}

	async queryRow(sql, options = {}, transaction = null) {
		let rows = await this.query(sql, options, transaction);

		return rows[0];
	}

	async queryVal(sql, options = {}, transaction = null) {
		let rows = await this.queryRow(sql, options, transaction);

		return rows[ Object.keys(rows).first ];
	}

	async transaction(callback, errorCallback = fn=>{}) {
		return this.db.transaction(function(trx) {
			attachWorkers(trx);
			return callback.apply(this, arguments);
		}, errorCallback);
	}
}

/** @type Mysql */
global.DB = {};
Object.defineProperty(global, 'DB', {
	get: function() {
		return Mysql.Instance;
	}
});

