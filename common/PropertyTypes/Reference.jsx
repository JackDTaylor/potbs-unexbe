/**
 * O2M model type
 * @type {Function}
 */
global.PropertyType.MODEL = class MODEL extends PropertyType.GENERIC {
	static PrimitiveType = Type.OBJECT;
	static ParamNames = ['code'];

	/**
	 * Returns raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param property
	 */
	async getRawValue(property) {
		let code = property.link.model;
		let id = this.data[property.link.idKey] || null;

		if(!id) {
			return await null;
		}

		return await this.getReferencedModel(code, id);
	}

	/**
	 * Writes raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param val
	 * @param property
	 */
	setRawValue(val, property) {
		console.warn('PropertyType.MODELS::setRawValue', val, property);
		throw new Error('Not implemented');
	}
};

/**
 * M2M model type
 * @type {Function}
 */
global.PropertyType.MODELS = class MODELS extends PropertyType.GENERIC {
	static PrimitiveType = Type.ARRAY;
	static ParamNames = ['code'];

	/**
	 * Returns raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param property
	 */
	async getRawValue(property) {
		let propertyName = property.link.fullKey;

		if(propertyName in this.referenceData == false) {
			let code = property.link.model;
			let ids = this.data[property.link.idKey] || [];

			this.referenceData[propertyName] = await this.getReferencedModels(code, ids);
		}

		return this.referenceData[propertyName];
	}

	/**
	 * Writes raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param val
	 * @param property
	 */
	setRawValue(val, property) {
		console.warn('PropertyType.MODELS::setRawValue', val, property);
		throw new Error('Not implemented');
	}

};

/**
 * O2M model type
 * @type {Function}
 */
global.PropertyType.MODEL_ID = class MODEL_ID extends PropertyType.GENERIC {
	static PrimitiveType = Type.NUMBER;
	static ParamNames = ['code'];
};

/**
 * M2M model id type
 * @type {Function}
*/
global.PropertyType.MODEL_IDS = class MODEL_IDS extends PropertyType.GENERIC {
	static PrimitiveType = Type.ARRAY;
	static ParamNames = ['code'];
};