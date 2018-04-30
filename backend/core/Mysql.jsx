import {DB_CONFIG} from "../config";
import Knex from "knex";
import QueryBuilder from "./Mysql/QueryBuilder";
import QueryCompiler from "./Mysql/QueryCompiler";

import "./Managers/ModelManager";


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
		let builder = fn => new QueryBuilder(this.db.client);
		let compiler = builder => new QueryCompiler(this.db.client, builder);

		this.db = Knex({...config });

		this.db.queryBuilder        = builder;
		this.db.client.queryBuilder = builder;

		this.db.queryCompiler        = compiler;
		this.db.client.queryCompiler = compiler;
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


	async query(sql, options = {}) {
		let response = (await this.db.raw(sql, options))[0];

		if(valueType(response) == Array) {
			return response.map(row => ({...row}));
		}

		return response;
	}

	async queryRow(sql, options = {}) {
		let rows = await this.query(sql, options);

		return rows[0];
	}

	async queryVal(sql, options = {}) {
		let rows = await this.queryRow(sql, options);

		return rows[ Object.keys(rows).first ];
	}
}

/** @type Mysql */
global.DB = {};
Object.defineProperty(global, 'DB', {
	get: function() {
		return Mysql.Instance;
	}
});

