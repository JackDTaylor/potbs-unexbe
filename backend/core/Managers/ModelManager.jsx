import StateFetcher from "../Mysql/StateFetcher";
import BackendModel from "../BackendModel";
import Lang from "../Lang";
import {ModelFiles} from "../../models";

let tableNames = {};
let models = {};
let bundleUrls = {};

class ModelManager {
	get(code) {
		if(code in tableNames === false) {
			throw new Error(`Model '${code}' not found`);
		}

		return models[ tableNames[code] ];
	}

	getTableName(code) {
		return tableNames[code];
	}

	get bundleUrls() {
		return bundleUrls;
	}

	/**
	 * @public
 	 * @return {Promise.<void>}
	 */
	async prepare() {
		const state = await StateFetcher.GetState();

		for(let i = 0; i < ModelFiles.length; i++) {
			await this.prepareModel(ModelFiles[i], state);
		}

		await this.establishLinks(state);

		await Object.keys(models).forEachAsync(async tableName => {
			await this.postprocessModel(models[tableName]);
		});
	}

	/**
	 * @protected
	 * @param modelName
	 * @return {Promise.<void>}
	 */
	async loadModel(modelName) {
		modelName = modelName.replace(/[^a-zA-Z0-9/]/g, '');

		if(ModelFiles.has(`/${modelName}.jsx`) === false) {
			throw new Error(`Model '${modelName}' not found`);
		}

		return (await Bluebird.resolve(import('../../../models/' + modelName))).default;
	}
	/**
	 * @protected
	 * @param path
	 * @param state
	 * @return {Promise.<void>}
	 */
	async prepareModel(path, state) {
		const modelName = path.replace(/^\//, '').replace(/\.jsx$/, '');
		const tableName = modelName.replace(/\//g, '_').toLowerCase();

		tableNames[ modelName ] = tableName;

		const Class = await this.loadModel(modelName);

		console.assert(Object.getPrototypeOf(Class) == BackendModel, `${modelName} derives from BackendModel`);

		// Backend
		Class.Options = { ...state.tables[tableName].options, ...(Class.Options || {}) };

		Class.CustomProperties = Class.CustomProperties || {};
		Class.DatabaseProperties = state.tables[tableName].columns;

		// Common
		Class.Code = modelName;
		Class.Links = {};
		Class.Layout = {};

		// Write only database props (without override, it should come after links are established)
		Object.keys(Class.DatabaseProperties).forEach(property => {
			Class.Layout[property] = Class.DatabaseProperties[property];
		});

		models[tableName] = Class;
	}

	/**
	 * @protected
	 * @param Class
	 * @return {Promise.<void>}
	 */
	async postprocessModel(Class) {
		// Apply overrides
		Object.keys(Class.CustomProperties).forEach(property => {
			const override = Class.CustomProperties[property];

			if(property in Class.Layout == false) {
				// Create if not exists
				Class.Layout[property] = new PropertyDescriptor(property);
			}

			// Override existing property with custom params
			Class.Layout[property].override(override);
		});

		// Property language data
		Object.keys(Class.Layout).forEach(property => {
			let key = property;

			if(Class.Layout[property].link) {
				key = Class.Layout[property].link.fullKey;
			}

			Class.Layout[property].label = Lang.key(Lang.FIELD_NAME, key, Class.Code);
			Class.Layout[property].description = Lang.key(Lang.FIELD_DESCRIPTION, key, Class.Code);
			Class.Layout[property].placeholder = Lang.key(Lang.FIELD_PLACEHOLDER, key, Class.Code);

			// Finalize property
			Class.Layout[property].postprocess();
		});

		// Define accessors
		await Class.Prepare(Class.Code);

		if(Class.BundleURL) {
			bundleUrls[Class.BundleURL] = Class.Code;
		}
	}

	/**
	 * @protected
	 * @param state
	 * @return {Promise.<void>}
	 */
	async establishLinks(state) {
		const o2mLinks = state.links.filter(l => l.type == Link.O2M);
		const m2mLinks = state.links.filter(l => l.type == Link.M2M);

		o2mLinks.forEach(link => {
			const source = link.source;
			const target = link.target;
			const params = link.params || {};

			const SrcModel = models[source.table];
			const TgtModel = models[target.table];

			const sourceTableName = state.tables[source.table].options.name;

			const sourceLinkName = source.column.replace(/_id$/, '');
			const targetLinkName = params.as || sourceTableName.plural;

			console.assert(SrcModel, `model for '${source.table}' exists`);
			console.assert(TgtModel, `model for '${target.table}' exists`);

			const SL = SrcModel.Layout;
			const TL = TgtModel.Layout;

			const srcLink = {
				type: Link.O2M,
				model: TgtModel.Code,
				fullKey: sourceLinkName,
				idKey: source.column,
				lnk: link
			};

			const tgtLink = {
				type: Link.M2O,
				model: SrcModel.Code,
				fullKey: targetLinkName,
				idKey: idPropertyNameFromFull(targetLinkName),
				through: source.table,
				foreignKey: source.column,
			};

			console.assert(srcLink.idKey in SL, `${SrcModel.Code}.${source.column} exists`);

			// acl_user.group_id
			SL[srcLink.idKey].override({
				type: PropertyType.MODEL_ID(srcLink.model),
				scope: Scope.Writable,
				link: srcLink
			});

			// acl_user.group
			SL[srcLink.fullKey] = new PropertyDescriptor(srcLink.fullKey, {
				type: PropertyType.MODEL(srcLink.model),
				scope: Scope.Readable,
				link: srcLink
			});

			// acl_group.user_ids
			TL[tgtLink.idKey] = new PropertyDescriptor(tgtLink.idKey, {
				type: PropertyType.MODEL_IDS(tgtLink.model),
				scope: Scope.Writable,
				link: tgtLink
			});

			// acl_group.users
			TL[tgtLink.fullKey] = new PropertyDescriptor(tgtLink.fullKey, {
				type: PropertyType.MODELS(tgtLink.model),
				scope: Scope.Readable,
				link: tgtLink
			});

			SrcModel.Links[sourceLinkName] = srcLink;
			TgtModel.Links[targetLinkName] = tgtLink;
		});

		m2mLinks.forEach(link => {
			const pairs = [
				[link.left, link.right],
				[link.right, link.left]
			];

			pairs.forEach(pair => {
				const source = pair[0];
				const target = pair[1];

				const SrcModel = models[source.table];
				const TgtModel = models[target.table];

				console.assert(SrcModel, `model for '${source.table}' exists`);
				console.assert(TgtModel, `model for '${target.table}' exists`);

				const SL = SrcModel.Layout;
				const TgtModelName = TgtModel.Options.name;

				const srcLink = {
					type:       Link.M2M,
					through:    link.through,
					foreignKey: source.column,
					otherKey:   target.column,

					model:      TgtModel.Code,
					fullKey:    `${TgtModelName.plural}`,
					idKey:      `${TgtModelName.singular}_ids`,
				};

				// acl_user.group_ids
				SL[srcLink.idKey] = new PropertyDescriptor(srcLink.idKey, {
					type: PropertyType.MODEL_IDS(srcLink.model),
					scope: Scope.Writable,
					link: srcLink
				});

				// acl_user.groups
				SL[srcLink.fullKey] = new PropertyDescriptor(srcLink.fullKey, {
					type: PropertyType.MODELS(srcLink.model),
					scope: Scope.Readable,
					link: srcLink
				});

				SrcModel.Links[TgtModelName.plural] = srcLink;
			});
		});
	}
}

global.ModelManager = new ModelManager();