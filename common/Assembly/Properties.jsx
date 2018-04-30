const utils = _decoratorUtils;

global.abstract = function(proto, field) {
	return {
		get() {
			const name = valueType(this) == Function ? this.name : this.constructor.name;
			throw new Error(`${name}::${field} is marked as abstract and should be overriden`);
		},

		set(value) {
			Object.defineProperty(this, field, {value, configurable: true })
		}
	};
};

global.scoped  = scope  =>  defineKey('scope',  scope);
global.secure  = defineKey('secure', true);
global.hidden  = defineKey('hidden', true);
global.rowLink = defineKey('rowLink', true);
global.type    = type => defineKey('type', type);

global.cellRenderer   = fn => defineKey('cellRenderer',   fn);
global.fieldRenderer  = fn => defineKey('fieldRenderer',  fn);
global.detailRenderer = fn => defineKey('detailRenderer', fn);

global.property = function(proto, field, descriptor) {
	let value = utils.decoratedValue(descriptor, {});

	const Model = proto.constructor;

	Model.CustomProperties = Model.CustomProperties || {};
	Model.CustomProperties[field] = value;

	return {
		value: Model.CustomProperties[field],
		configurable: true,
	};
};

global.PropertyDescriptor = class PropertyDescriptor {
	type = PropertyType.VARCHAR(2**31);
	name = null;

	label = 'unknown';
	description = '';
	placeholder = '';

	primaryKey = false;
	autoIncrement = false;
	allowNull = false;
	unique = false;
	hidden = false;
	stored = false;
	defaultValue = null;
	writable = true;
	secure = false;

	expr = null;
	get = null;
	set = null;
	scope = Scope.ALL;

	cellRenderer = null;
	fieldRenderer = null;
	detailRenderer = null;

	constructor(name, data = {}) {
		this.name = name;

		this.override(data);
	}

	override(data = {}) {
		Object.assign(this, data);
	}

	get queryable() {
		return !!(this.stored || this.expr);
	}

	get subquery() {
		if(!this.referential) {
			return false;
		}

		return this.link.isFull || this.link.requiresSubquery;
	}

	get referential() {
		return !!this.link;
	}

	get sortable() {
		return this.queryable;
	}

	get filterable() {
		return this.queryable;
	}

	get listRowLink() {
		return !this.cellRenderer && (this.name == 'name' || this.rowLink)
	}

	postprocess() {
		if(this.name == ID) {
			// ID props are always readonly and hidden
			this.writable = false;
			this.hidden = true;
		}

		if(this.expr && !this.set) {
			// Virtual props are readonly if they have no setter
			this.writable = false;
		}

		if(this.secure) {
			// Secure props are not available for reading
			this.scope = this.scope & Scope.Writable;
		}
	}

	getCellRenderer() {
		return GetRenderer(this.cellRenderer || this.type.cellRenderer || CellRenderers.DefaultCell);
	}

	getFieldRenderer() {
		return GetRenderer(this.fieldRenderer || this.type.fieldRenderer || FieldRenderers.DefaultField);
	}

	getDetailRenderer() {
		return GetRenderer(this.detailRenderer || this.type.detailRenderer || this.getCellRenderer());
	}

	toJSON() {
		const defaults = new PropertyDescriptor(null);
		const result = {...this};

		// Compact notation
		Object.keys(result).forEach(key => {
			if(defaults[key] === result[key]) {
				delete result[key];
			}
		});

		if(result.get) result.get = true;
		if(result.set) result.set = true;

		return result;
	}
};
