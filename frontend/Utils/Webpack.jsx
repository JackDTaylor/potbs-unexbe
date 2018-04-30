/** @return {Object} */
import FrontendModel from "../Application/FrontendModel";

window.GetComponent = async function GetComponent(path) {
	try {
		return (await Bluebird.resolve(import('../' + path))).default;
	} catch(e) {
		console.error(`Component not found: ${path}`);
	}

	return null;
};

const models = {};
const modelMetas = {};

let modelMetaStatus = null;

let fetchModelMetaAvailability = async function() {
	if(modelMetaStatus == null) {
		modelMetaStatus = await API.get('entityLayout.availableMeta');
	}

	return modelMetaStatus;
};

window.GetModelMeta = async function GetModelMeta(path, type, Model, MetaClass) {
	const key = `${path}.${type}`;

	if(key in modelMetas == false) {
		try {
			let metaAvailability = await fetchModelMetaAvailability();

			if(metaAvailability.has(key)) {
				let Metadata = (await Bluebird.resolve(import('../../models/' + key))).default;

				modelMetas[key] = new Metadata(Model);
			} else {
				modelMetas[key] = new class extends MetaClass {};
			}

			if(modelMetas[key] instanceof MetaClass == false) {
				console.error(`${key} have to be derived from ${MetaClass.name}`);
			}
		} catch(e) {
			console.error(`Cannot load model meta: ${key}`, e);
			modelMetas[key] = null;
		}
	}

	return modelMetas[key];
};

/** @return {Object} */
window.GetModel = async function GetModel(path) {
	const code = path;

	if(code in models == false) {
		try {
			const Model = (await Bluebird.resolve(import('../../models/' + path))).default;

			console.assert(Object.getPrototypeOf(Model) == FrontendModel, `${path} derives from FrontendModel`);

			Model.GridConfig = await GetModelMeta(path, ModelMeta.GRID_CONFIG, Model, GridConfig);
			Model.FormConfig = await GetModelMeta(path, ModelMeta.FORM_CONFIG, Model, FormConfig);

			await Model.Prepare(code);

			models[code] = Model;
		} catch(e) {
			console.error(`Cannot load model: ${path}`, e);
			return null;
		}
	}

	return models[code];
};
