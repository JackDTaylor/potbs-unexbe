import Sequelize from "sequelize";
import {DB_DSN, DB_OPTIONS} from "../config";
import StateFetcher from "./Mysql/StateFetcher";
import {ModelFiles} from "../models";
import Application from "./Application";
import BackendModel from "./BackendModel";

Sequelize.INT       = Sequelize.INT       || Sequelize.INTEGER;
Sequelize.VARCHAR   = Sequelize.VARCHAR   || Sequelize.STRING;
Sequelize.TEXT      = Sequelize.TEXT      || Sequelize.STRING;
Sequelize.TIMESTAMP = Sequelize.TIMESTAMP || Sequelize.DATE;

export class SequelizeEx extends Sequelize {
	async select(query, replacements) {
		const type = Sequelize.QueryTypes.SELECT;

		return await this.query(query, { type, replacements });
	}
}

global.$and        = Sequelize.Op.and;
global.$or         = Sequelize.Op.or;
global.$gt         = Sequelize.Op.gt;
global.$gte        = Sequelize.Op.gte;
global.$lt         = Sequelize.Op.lt;
global.$lte        = Sequelize.Op.lte;
global.$ne         = Sequelize.Op.ne;
global.$eq         = Sequelize.Op.eq;
global.$not        = Sequelize.Op.not;
global.$between    = Sequelize.Op.between;
global.$notBetween = Sequelize.Op.notBetween;
global.$in         = Sequelize.Op.in;
global.$notIn      = Sequelize.Op.notIn;
global.$like       = Sequelize.Op.like;
global.$notLike    = Sequelize.Op.notLike;
global.$iLike      = Sequelize.Op.iLike;
global.$notILike   = Sequelize.Op.notILike;
global.$regexp     = Sequelize.Op.regexp;
global.$notRegexp  = Sequelize.Op.notRegexp;
global.$iRegexp    = Sequelize.Op.iRegexp;
global.$notIRegexp = Sequelize.Op.notIRegexp;
global.$any        = Sequelize.Op.any;
global.$overlap    = Sequelize.Op.overlap;
global.$contains   = Sequelize.Op.contains;
global.$contained  = Sequelize.Op.contained;
global.$any        = Sequelize.Op.any;
global.$col        = Sequelize.Op.col;

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

	// get test() {}
	/** @type {Sequelize} */
	db = null;
	models = {};

	static async Initialize() {
		const connection = new SequelizeEx(DB_DSN, DB_OPTIONS);
		const state = await StateFetcher.GetState(connection);

		instance = new Mysql(connection);

		await instance.prepareModels(state);
	}

	constructor(connection) {
		this.db = connection;
	}

	getCustomProperties(Model, columns) {
		const result = {
			columns: {},
			getterMethods: {},
			setterMethods: {},
		};

		if(Model.CustomProperties) {
			Object.keys(Model.CustomProperties).forEach(propertyName => {
				let property = Model.CustomProperties[ propertyName ];

				if(propertyName in columns) {
					property = {
						...columns[propertyName],
						...property,
					};
				}

				if(valueType(property.type) == String && property.type.toUpperCase() in Mysql) {
					property.type = Mysql[ property.type.toUpperCase() ];
				}

				if(!property.type) {
					property.type = SequelizeEx.STRING;
				}

				if(property.expr) {
					property.type = SequelizeEx.VIRTUAL(SequelizeEx.STRING, `${property.expr} as \`${propertyName}\` /*.*/`)
				}

				if(property.get) {
					result.getterMethods[propertyName] = property.get;
					delete property.get;
				}

				if(property.set) {
					result.setterMethods[propertyName] = property.set;
					delete property.set;
				}

				if(propertyName == 'password_hash') {
					result.getterMethods[propertyName] = fn => '<hidden>';
				}

				result.columns[propertyName] = property;
			});
		}

		return result;
	}

	generateModelBackend(Model) {
		const ModelBackend = Model.Backend({
			Sequelize,
			base: aggregation(BackendModel, Model)
		});

		Object.defineProperty(ModelBackend, 'name', {value: Model.TableName});

		return ModelBackend;
	}

	async prepareModel(path, state) {
		const modelName = path.replace(/^\//, '').replace(/\.jsx$/, '');
		const tableName = modelName.replace(/\//g, '_').toLowerCase();

		const Model = await Application.GetModel(modelName, true);
		Object.defineProperty(Model, 'ModelName', {value: modelName});
		Object.defineProperty(Model, 'TableName', {value: tableName});

		const ModelBackend = this.generateModelBackend(Model);

		let tableState = state.tables[tableName];

		console.assert(ModelBackend, `backend model of '${modelName}' exists`);
		console.assert(tableState, `table state of '${modelName}' exists`);

		tableState.options = tableState.options || {};

		const customProperties = this.getCustomProperties(Model, tableState.columns);

		ModelBackend.dbColumns = {
			...tableState.columns,
			...customProperties.columns,
		};

		ModelBackend.dbOptions = {
			...tableState.options,

			getterMethods: {
				...tableState.options.getterMethods,
				...customProperties.getterMethods,
			},

			setterMethods: {
				...tableState.options.setterMethods,
				...customProperties.setterMethods,
			},

			sequelize: this.db,
		};

		ModelBackend.init(ModelBackend.dbColumns, ModelBackend.dbOptions);
		Model.Backend = ModelBackend;

		Model.Backend.modelName = modelName;
		Model.Backend.tableName = tableName;

		Model.Backend.flatColumns = Object.keys(ModelBackend.dbColumns);
		Model.Backend.refColumns = [];
		Model.Backend.linkColumns = [];
		Model.Backend.links = {};

		Object.defineProperty(Model.Backend, 'allColumns', {
			get: function() {
				return [...this.flatColumns, ...this.refColumns, ...this.linkColumns]
			}
		});

		Object.defineProperty(Model.Backend, 'listColumns', {
			get: function() {
				return [...this.flatColumns, ...this.linkColumns]
			}
		});

		Object.defineProperty(Model.Backend, 'formColumns', {
			get: function() {
				return [...this.flatColumns, ...this.refColumns ]
			}
		});

		this.models[tableName] = ModelBackend;
	}

	async prepareModels(state) {
		for(let i = 0; i < ModelFiles.length; i++) {
			await this.prepareModel(ModelFiles[i], state);
		}

		await this.establishLinks(state);
	}

	async establishLinks(state) {
		const models = this.models;

		state.links.forEach(link => {
			if(link.type == Link.O2M) {
				const source = link.source;
				const target = link.target;
				const params = link.params || {};

				const sourceTable = models[source.table];
				const targetTable = models[target.table];

				const sourceTableName = state.tables[source.table].options.name;

				console.assert(models[source.table], `model for '${source.table}' exists`);
				console.assert(models[target.table], `model for '${target.table}' exists`);

				models[target.table].hasMany(models[source.table], {
					foreignKey: source.column,
					sourceKey: target.column,
					as: params.as || sourceTableName.plural
				});

				models[source.table].belongsTo(models[target.table], {
					foreignKey: source.column,
					targetKey: target.column
				});

				sourceTable.flatColumns = sourceTable.flatColumns.filter(x => x != source.column);
				sourceTable.refColumns.push(source.column);

				const sourceLinkName = source.column.replace(/_id$/, '');
				const targetLinkName = params.as || sourceTableName.plural;

				sourceTable.linkColumns.push(sourceLinkName);
				targetTable.linkColumns.push(targetLinkName);

				sourceTable.links[sourceLinkName] = {
					type: Link.O2M,
					modelName: targetTable.modelName,
					fullKey: sourceLinkName,
					idKey: source.column,
				};

				targetTable.links[targetLinkName] = {
					type: Link.M2M,
					modelName: sourceTable.modelName,
					fullKey: targetLinkName,
					idKey: idPropertyNameFromFull(targetLinkName)
				};
			}

			if(link.type == Link.M2M) {
				// Array of pairs `[ source, target ]` to generate M2M links
				const pairs = [
					[link.left, link.right],
					[link.right, link.left]
				];

				pairs.forEach(pair => {
					const source = pair[0];
					const target = pair[1];

					console.assert(models[source.table], `model for '${source.table}' exists`);
					console.assert(models[target.table], `model for '${target.table}' exists`);

					const targetTableName = state.tables[target.table].options.name;

					models[source.table].belongsToMany(models[target.table], {
						through:    link.through,
						foreignKey: source.column,
						otherKey:   target.column,
						as:         targetTableName.plural,
					});

					models[source.table].linkColumns.push(targetTableName.plural);

					models[source.table].links[targetTableName.plural] = {
						type: link.type,
						modelName: models[target.table].modelName,
						fullKey: targetTableName.plural,
						idKey: `${targetTableName.singular}_ids`,
					};
				});
			}
		});
	}

	async query(sql, options = {}) {
		let rows = await this.db.query(sql, options);

		return rows.map(c => c);
	}
}

Mysql['ABSTRACT']         = Sequelize['ABSTRACT'];
Mysql['STRING']           = Sequelize['STRING'];
Mysql['CHAR']             = Sequelize['CHAR'];
Mysql['TEXT']             = Sequelize['TEXT'];
Mysql['NUMBER']           = Sequelize['NUMBER'];
Mysql['TINYINT']          = Sequelize['TINYINT'];
Mysql['SMALLINT']         = Sequelize['SMALLINT'];
Mysql['MEDIUMINT']        = Sequelize['MEDIUMINT'];
Mysql['INTEGER']          = Sequelize['INTEGER'];
Mysql['BIGINT']           = Sequelize['BIGINT'];
Mysql['FLOAT']            = Sequelize['FLOAT'];
Mysql['TIME']             = Sequelize['TIME'];
Mysql['DATE']             = Sequelize['DATE'];
Mysql['DATEONLY']         = Sequelize['DATEONLY'];
Mysql['BOOLEAN']          = Sequelize['BOOLEAN'];
Mysql['NOW']              = Sequelize['NOW'];
Mysql['BLOB']             = Sequelize['BLOB'];
Mysql['DECIMAL']          = Sequelize['DECIMAL'];
Mysql['NUMERIC']          = Sequelize['NUMERIC'];
Mysql['UUID']             = Sequelize['UUID'];
Mysql['UUIDV1']           = Sequelize['UUIDV1'];
Mysql['UUIDV4']           = Sequelize['UUIDV4'];
Mysql['HSTORE']           = Sequelize['HSTORE'];
Mysql['JSON']             = Sequelize['JSON'];
Mysql['JSONB']            = Sequelize['JSONB'];
Mysql['VIRTUAL']          = Sequelize['VIRTUAL'];
Mysql['ARRAY']            = Sequelize['ARRAY'];
Mysql['NONE']             = Sequelize['NONE'];
Mysql['ENUM']             = Sequelize['ENUM'];
Mysql['RANGE']            = Sequelize['RANGE'];
Mysql['REAL']             = Sequelize['REAL'];
Mysql['DOUBLE']           = Sequelize['DOUBLE'];
Mysql['DOUBLE PRECISION'] = Sequelize['DOUBLE PRECISION'];
Mysql['DOUBLE_PRECISION'] = Sequelize['DOUBLE PRECISION'];
Mysql['GEOMETRY']         = Sequelize['GEOMETRY'];
Mysql['GEOGRAPHY']        = Sequelize['GEOGRAPHY'];

/** @type Mysql */
global.DB = {};
Object.defineProperty(global, 'DB', {
	get: function() {
		return Mysql.Instance;
	}
});

