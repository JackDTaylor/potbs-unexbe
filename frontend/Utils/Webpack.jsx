/** @return {Object} */
window.GetComponent = async function GetComponent(path) {
	try {
		return (await import('../' + path)).default;
	} catch(e) {
		console.error(`Component not found: ${path}`);
	}

	return null;
};

const defaultEntityRenderer = function(model, id) {
	return `${model}:${id}`;
};
/** @return {Object} */
window.GetModel = async function GetModel(path) {
	try {
		const Model = (await import('../../models/' + path)).default;
		const FrontendModel = Model.Frontend({ base: aggregation(window.Frontend.Model, Model) });

		FrontendModel.Code = path;
		FrontendModel.Name = Model.Name;

		FrontendModel.Layout = await API.entityLayout(FrontendModel.Code);

		Object.values(FrontendModel.Layout).forEach(column => {
			if(column.linked && column.linked.role == 'fullKey') {
				const link = column.linked.link;
				const idKey = link.idKey;

				if(link.type == Link.O2M) {
					Object.defineProperty(FrontendModel.prototype, column.name, {
						get: function() {
							return defaultEntityRenderer(link.modelName, this[idKey]);
						}
					});
				}

				if(link.type == Link.M2M) {
					Object.defineProperty(FrontendModel.prototype, column.name, {
						get: function() {
							const value = this[idKey] || [];

							return value.map(id => defaultEntityRenderer(link.modelName, id));
						}
					});
				}
			}
		});

		return FrontendModel;
	} catch(e) {
		console.error(`Model not found: ${path}`, e);
	}

	return null;
};
