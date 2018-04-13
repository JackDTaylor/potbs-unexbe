import ApiModule from "../../core/ApiModule";
import Application from "../../core/Application";
import Lang from "../../core/Lang";
import ACL from "../../core/ACL";

export default class EntityLayoutModule extends ApiModule {
	get endpoints() {
		return ['get'];
	}

	async getEndpoint() {
		const Model = await Application.GetModel(this.request.query.model);

		let scope = false;

		if(this.request.query.scope) {
			const scopeQuery = `${this.request.query.scope}`.toUpperCase();

			scope = parseInt(scopeQuery) || false;

			if(scope == false && scopeQuery in Scope) {
				scope = Scope[scopeQuery];
			}
		}

		return await this.getLayout(Model, scope);
	}

	getDefaultColumnLayout(Model, key) {
		return {
			name: key,
			label: Lang.key(Lang.FIELD_NAME, key, Model.modelName),
			description: Lang.key(Lang.FIELD_DESCRIPTION, key, Model.modelName),
			placeholder: Lang.key(Lang.FIELD_PLACEHOLDER, key, Model.modelName),
		}
	}

	async getPlainFields(Model) {
		const result = {};

		// Plain fields
		Object.keys(Model.attributes).forEach(key => {
			if(key == 'id') {
				return;
			}

			const column = Model.dbColumns[key];

			let type = column.type || column.returnType;
			let typeName = 'STRING';
			let isVirtual = false;

			if(type && type.constructor) {
				let realType = type;

				if(type.constructor.name == 'VIRTUAL') {
					isVirtual = true;

					if(type.returnType) {
						realType = type.returnType;
					}
				}

				typeName = realType.constructor.name;
			}

			result[key] = {
				...this.getDefaultColumnLayout(Model, key),

				scope: column.scope || (isVirtual ? Scope.Readable : Scope.ALL),
				type: typeName,
				required: column.allowNull == false,
				virtual: isVirtual,
				defaultValue: column.defaultValue,
			};
		});

		return result;
	}

	async getLinkFields(Model) {
		const result = {};

		Object.values(Model.links).forEach(link => {
			// const idKey = addIdToPropertyName(key);

			result[link.idKey] = {
				...this.getDefaultColumnLayout(Model, link.fullKey),

				scope: Scope.Writable,
				type: Type.NUMBER,
				virtual: false,
				linked: { role: 'idKey', link }
			};

			result[link.fullKey] = {
				...this.getDefaultColumnLayout(Model, link.fullKey),

				scope: Scope.Readable,
				virtual: false,
				linked: { role: 'fullKey', link }
			};
		});

		return result;
	}

	async getLayout(Model, scope = false) {
		let result = {
			...await this.getPlainFields(Model),
			...await this.getLinkFields(Model),
		};

		if(scope !== false) {
			Object.keys(result).forEach(key => {
				const matchesScope = (result[key].scope & scope);

				if(matchesScope == false) {
					delete result[key];
				}
			});
		}

		return result;
	}
}