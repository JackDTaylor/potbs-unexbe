import {FileSystemAsync} from "../FileSystem";

class State {
	tables = {};
	links = [];

	static GetTableColumns(tableData) {
		const columns = tableData.COLUMNS;
		const columnsLayout = {};

		columns.forEach(column => {
			if(column.DATA_TYPE.toUpperCase() in PropertyType === false) {
				throw new Error(`Unknown type "${column.DATA_TYPE}"`);
			}

			let type = column.COLUMN_TYPE.split('(');
			type[0] = type[0].toUpperCase();
			type = type.join('(');

			columnsLayout[ column.COLUMN_NAME ] = {
				type: 'types.' + type,
				primaryKey: column.COLUMN_KEY == 'PRI',
				autoIncrement: column.COLUMN_KEY == 'PRI',
				allowNull: column.IS_NULLABLE == 'YES',
				unique: column.UNIQUE_KEY_NAME || false,
				defaultValue: column.COLUMN_DEFAULT ? { expr: column.COLUMN_DEFAULT } : null,
			};
		});

		return columnsLayout;
	}

	static GetTableOptions(tableData) {
		let columns = tableData.COLUMNS;

		let nameSingular = tableData.TABLE_NAME
			.split('_')
			.slice(1)
			// .map((part, i) => i > 0 ? part.ucFirst(): part)
			.join('_');

		let namePlural = (nameSingular + 's')
			.replace(/ss$/, 'ses')
			.replace(/([^aeiouy])ys$/, '$1ies');

		let nameId = (nameSingular + '_ids');

		let columnNames = columns.map(column => column.COLUMN_NAME);

		return {
			tableName: tableData.TABLE_NAME,
			createdAt: columnNames.has('date_created') ? 'date_created' : false,
			updatedAt: columnNames.has('date_updated') ? 'date_updated' : false,
			deletedAt: columnNames.has('date_deleted') ? 'date_deleted' : false,
			name: {
				singular: nameSingular,
				plural: namePlural,
				id: nameId,
			},
			defaultScope: {
				attributes: { exclude: [] }
			}
		};
	}

	/**
	 * @param tableData
	 */
	defineTable(tableData) {
		this.tables[tableData.TABLE_NAME] = {
			columns: State.GetTableColumns(tableData),
			options: State.GetTableOptions(tableData),
		};

		if(tableData.FOREIGN_KEYS) {
			tableData.FOREIGN_KEYS.forEach(k => this.defineO2MLink(k));
		}
	}

	/**
	 * @param linkData
	 */
	defineO2MLink(linkData) {
		this.links.push({
			type: Link.O2M,
			source: {
				table: linkData.TABLE_FROM,
				column: linkData.COLUMN_NAMES[0],
			},
			target: {
				table: linkData.TABLE_TO,
				column: ID,
			},
			updateRule: linkData.UPDATE_RULE,
			deleteRule: linkData.DELETE_RULE,
			params: linkData.PARAMS,
		});
	}

	/**
	 * @param linkTableData
	 */
	defineM2MLink(linkTableData) {
		const keyA = linkTableData.FOREIGN_KEYS[0];
		const keyB = linkTableData.FOREIGN_KEYS[1];

		this.links.push({
			type: Link.M2M,
			through: linkTableData.TABLE_NAME,
			left: {
				table: keyA.TABLE_TO,
				column: keyA.COLUMN_NAMES[0],
			},
			right: {
				table: keyB.TABLE_TO,
				column: keyB.COLUMN_NAMES[0],
			},
		});
	}

	/**
	 * @param tableData
	 * @return {*}
	 */
	registerTable(tableData) {
		tableData.COLUMNS = this.columnsMap[tableData.TABLE_NAME];
		tableData.FOREIGN_KEYS = this.foreignKeysMap[tableData.TABLE_NAME];

		const pkCount = tableData.COLUMNS.filter(c => c.COLUMN_KEY == 'PRI').length;
		const fkCount = tableData.FOREIGN_KEYS ? tableData.FOREIGN_KEYS.length : 0;

		if(pkCount == 1) {
			return this.defineTable(tableData);
		}

		if(pkCount == 2 && fkCount == 2) {
			return this.defineM2MLink(tableData);
		}

		console.warn(`Wrong table layout for "${tableData.TABLE_NAME}"`);
	}
}

export default class StateFetcher {
	static PostprocessState(state) {
		Object.keys(state.tables).forEach(tableName => {
			Object.keys(state.tables[tableName].columns).forEach(columnName => {
				const column = state.tables[tableName].columns[columnName];

				if(valueType(column.type) == String) {
					column.type = new Function('types', `return ${column.type}`)(PropertyType);
				}

				if(column.defaultValue && 'expr' in column.defaultValue) {
					let value = column.defaultValue.expr;

					if(/[^\d]/.test(value)) {
						value = `"${value.replace('"', '\\"')}"`;
					}

					column.defaultValue = new Function(`return ${value}`)();

					if(column.defaultValue == 'CURRENT_TIMESTAMP' || column.defaultValue === 'NULL') {
						column.defaultValue = null;
					}
				}

				// This column is definitely stored in database
				column.stored = true;
				column.scope = Scope.ALL;

				state.tables[tableName].columns[columnName] = new PropertyDescriptor(columnName, column);
			});
		});

		return state;
	}

	static async GetState(forceRefresh = false) {
		const stateCacheFile = Application.path(`/data/cached-state.json`);

		if(forceRefresh || await FileSystemAsync.exists(stateCacheFile) == false) {
			const stateFetcher = new StateFetcher;
			const fetchedState = await stateFetcher.fetchState(DB.connectionSettings.database);

			await FileSystemAsync.write(stateCacheFile, JSON.stringify(fetchedState));
		}

		let state = await FileSystemAsync.read(stateCacheFile);
		state = JSON.parse(state);

		return StateFetcher.PostprocessState(state);
	}

	/**
	 * Fetches all tables
	 * @param schema
	 * @return {Promise.<*>}
	 */
	async fetchTables(schema) {
		return await DB.query(`
			SELECT * 
			FROM information_schema.TABLES 
			WHERE TABLE_SCHEMA = :schema
		`, { schema });
	}

	/**
	 * Fetches all columns
	 * @param schema
	 * @return {Promise.<{}>}
	 */
	async fetchColumns(schema) {
		let columnsRaw = await DB.query(`
			SELECT *
			FROM information_schema.COLUMNS
			WHERE TABLE_SCHEMA = :schema
			GROUP BY TABLE_NAME, COLUMN_NAME
			ORDER BY ORDINAL_POSITION ASC
		`, { schema });

		let uniqueKeysRaw = await DB.query(`
			SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME 
			FROM information_schema.KEY_COLUMN_USAGE
			WHERE CONSTRAINT_NAME LIKE 'UK_%'
				AND CONSTRAINT_SCHEMA = :schema
		`, {schema});

		let uniqueKeys = {};

		uniqueKeysRaw.forEach(key => {
			let k = `${key.TABLE_NAME}.${key.COLUMN_NAME}`;

			if(k in uniqueKeys) {
				console.warn(`${k} has more than one unique key`);
				return;
			}

			uniqueKeys[k] = key.CONSTRAINT_NAME;
		});

		let columnsMap = {};
		columnsRaw.forEach(row => {
			const table = row.TABLE_NAME;

			row.UNIQUE_KEY_NAME = uniqueKeys[`${row.TABLE_NAME}.${row.COLUMN_NAME}`] || false;

			columnsMap[table] = columnsMap[table] || [];
			columnsMap[table].push(row);
		});

		return columnsMap;
	}

	/**
	 * Fetches foreign keys
	 * @param schema
	 * @return {Promise.<{}>}
	 */
	async fetchForeignKeys(schema) {
		let foreignKeysRaw = await DB.query(`
			SELECT
			  RC.CONSTRAINT_NAME,
			  RC.TABLE_NAME AS TABLE_FROM,
			  RC.REFERENCED_TABLE_NAME AS TABLE_TO,
			  RC.UPDATE_RULE,
			  RC.DELETE_RULE,
			  GROUP_CONCAT(KCU.COLUMN_NAME SEPARATOR '<!>') AS COLUMN_NAMES
			FROM information_schema.REFERENTIAL_CONSTRAINTS AS RC
			LEFT JOIN information_schema.KEY_COLUMN_USAGE AS KCU ON RC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
			WHERE RC.CONSTRAINT_SCHEMA = :schema
			GROUP BY RC.CONSTRAINT_NAME
		`, { schema });

		let foreignKeysMap = {};

		foreignKeysRaw.forEach(row => {
			const table = row.TABLE_FROM;

			row.COLUMN_NAMES = row.COLUMN_NAMES.split('<!>');
			row.PARAMS = JSON.parse(row.CONSTRAINT_NAME.split('<!>').slice(1).join('<!>') || '{}');

			if(row.COLUMN_NAMES.length > 1) {
				console.warn(`Unsupported combined foreign key ${row.CONSTRAINT_NAME}`);
			}

			foreignKeysMap[table] = foreignKeysMap[table] || [];
			foreignKeysMap[table].push(row);
		});

		return foreignKeysMap;
	}

	/**
	 * Fetches the whole DB state
	 * @return {Promise.<State>}
	 */
	async fetchState(schema) {
		let state = new State();

		const tables = await this.fetchTables(schema);

		state.columnsMap = await this.fetchColumns(schema);
		state.foreignKeysMap = await this.fetchForeignKeys(schema);

		tables.map(tableData => state.registerTable(tableData));

		return state;
	}
}