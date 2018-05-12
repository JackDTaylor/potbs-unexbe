/** @type {Object.<string,Function>}*/
global.PropertyType = class{};

/**
 * Generic type
 * @type {Function}
 */
global.PropertyType.GENERIC = class GENERIC {
	static PrimitiveType = Type.STRING;
	static ParamNames = [];

	static CellRenderer   = CellRenderers.DefaultCell;
	static FieldRenderer  = FieldRenderers.DefaultField;
	static DetailRenderer = null;

	constructor(...params) {
		const paramNames = this.constructor.ParamNames || [];

		params.forEach((paramValue, i) => {
			if(paramNames[i]) {
				this[ paramNames[i] ] = paramValue;
			}
		});
	}

	get isMultiline() {
		return false;
	}

	get cellRenderer() {
		return this.constructor.CellRenderer;
	}

	get fieldRenderer() {
		return this.constructor.FieldRenderer;
	}

	get detailRenderer() {
		return this.constructor.DetailRenderer;
	}

	where(value) {
		return value;
	}

	encodeValue(value) {
		return value;
	}

	decodeValue(value) {
		return value;
	}

	/**
	 * Returns raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param property
	 */
	getRawValue(property) {
		return this.data[property.name];
	}

	/**
	 * Writes raw property value
	 * NOTE: executed in model context
	 * @this CommonModel
	 * @param val
	 * @param property
	 */
	setRawValue(val, property) {
		this.data[property.name] = val;
	}

	toJSON() {
		return {
			$class: this.constructor.name,
			...this,
		}
	}
};

/**
 * Int type
 * @type {Function}
 */
global.PropertyType.INT = class INT extends PropertyType.GENERIC {
	static PrimitiveType = Type.NUMBER;
	static ParamNames = ['size'];
};

/**
 * Int type
 * @type {Function}
 */
global.PropertyType.INT = class INT extends PropertyType.GENERIC {
	static PrimitiveType = Type.NUMBER;
	static ParamNames = ['size'];
};

/**
 * Varchar type
 * @type {Function}
 */
global.PropertyType.VARCHAR = class VARCHAR extends PropertyType.GENERIC {
	static PrimitiveType = Type.STRING;
	static ParamNames = ['size'];

	where(value) {
		return { like: `%${DB.escape(value)}%` }
	}
};

/**
 * Text type
 * @type {Function}
 */
global.PropertyType.TEXT = class TEXT extends PropertyType.GENERIC {
	static PrimitiveType = Type.STRING;
	static ParamNames = [];

	get isMultiline() {
		return true;
	}
};

/**
 * JSON type
 * @type {Function}
 */
global.PropertyType.JSON = class JSON extends PropertyType.GENERIC {
	static PrimitiveType = Type.STRING;
	static CellRenderer = CellRenderers.JsonCell;
	static ParamNames = [];
};

/**
 * Timestamp type
 * @type {Function}
 */
global.PropertyType.TIMESTAMP = class TIMESTAMP extends PropertyType.GENERIC {
	static PrimitiveType = Type.DATE;
	static CellRenderer = CellRenderers.DateCell;
	static FieldRenderer = FieldRenderers.DateField;
	static ParamNames = [];

	encodeValue(value) {
		return value ? { date: value.timestamp } : null;
	}

	decodeValue(value) {
		return value && value.date ? new Date(value.date) : null;
	}
};

/**
 * Decimal type
 * @type {Function}
 */
global.PropertyType.DECIMAL = class DECIMAL extends PropertyType.GENERIC {
	static PrimitiveType = Type.NUMBER;
	static ParamNames = ['size', 'frac'];
};

require("./Reference");
require("./Custom");

PropertyType.$raw = {...PropertyType};

Object.keys(PropertyType.$raw).forEach(key => {
	const TypeCls = PropertyType.$raw[key];

	if(!TypeCls.ParamNames) dpr('test');

	if(TypeCls.ParamNames.length > 0) {
		Object.defineProperty(PropertyType, key, {
			value(...args) {
				return new TypeCls(...args);
			}
		});
	} else {
		Object.defineProperty(PropertyType, key, {
			get() {
				return new TypeCls;
			}
		});
	}
});

Object.defineProperty(global.PropertyType, 'ByClass', {
	value(cls, params) {
		delete params.$class;
		let Type = PropertyType.$raw[cls];
		return new Type(...Type.ParamNames.map(p => params[p]));
	}
});