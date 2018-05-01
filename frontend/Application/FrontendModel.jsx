import CommonModel from "../../common/Application/CommonModel";
import Link from "../Common/Link";

import "./FrontendModelMeta";

const frontendProperties = [
	'get',
	'set',
	'cellRendererOverride',
	'fieldRendererOverride',
	'detailRendererOverride'
];

/**
 * Test 2
 * @static {GridConfig} GridConfig
 * @static {FormConfig} FormConfig
 * @static {ViewConfig} ViewConfig
 *
 * @extends {CommonModel}
 * @global
 */
@reactified
export default class FrontendModel extends CommonModel {
	static SharedModelCache = {};

	/** @return Map */
	static get ModelCache() {
		if(this.Code in this.SharedModelCache == false) {
			this.SharedModelCache[ this.Code ] = new CacheStorage;
		}

		return this.SharedModelCache[ this.Code ];
	}

	static async Prepare(modelName) {
		this.CustomProperties = this.CustomProperties || {};

		const {code, links, layout } = await API.entityLayout(modelName);

		Object.keys(layout).forEach(key => {
			const type = layout[key].type;
			if(type && type.$class) {
				layout[key].type = PropertyType.ByClass(type.$class, type);
			}

			frontendProperties.forEach(prop => {
				layout[key][prop] = (this.CustomProperties[key] && this.CustomProperties[key][prop]) || null;
			});

			layout[key] = new PropertyDescriptor(key, layout[key]);

			if(layout[key].listRowLink) {
				layout[key].cellRendererOverride = CellRenderers.RowLinkCell;
			}
		});

		Object.defineProperty(this, 'Code', {value: code, configurable: true });
		Object.defineProperty(this, 'Links', {value: links, configurable: true });
		Object.defineProperty(this, 'Layout', {value: layout, configurable: true });

		return await CommonModel.Prepare.apply(this, arguments);
	}

	static InvalidateCache() {
		this.ModelCache.clear();
	}

	static async FindById(id) {
		if(this.ModelCache.has(id) == false) {
			const model = await API.findEntity(this.Code, id);

			this.ModelCache.set(id, model ? this.fromJSON(model) : null);
		}

		return this.ModelCache.get(id);
	}

	static async Search(params = {}, outMeta = {}) {
		let models = await API.listEntity(this.Code, params, outMeta);

		return models.map(data => {
			if(this.ModelCache.has(data.id) == false) {
				this.ModelCache.set(data.id, this.fromJSON(data));
			}

			return this.ModelCache.get(data.id);
		})
	}

	async getReferencedModels(code, ids) {
		console.verbose('getReferencedModels', this, code, ids);
		let Model = await GetModel(code);

		return ids.mapAsyncConcurrent(async id => await Model.FindById(id));
	}

	toReact() {
		return <Link href={this} />
	}
}

/** @type {typeof CommonModel} */
global.PlatformSpecificModel = FrontendModel;

/**
 * TestAAA
 * @type {FrontendModel}
 * @extends CommonModel
 */
global.FrontendModel = FrontendModel;