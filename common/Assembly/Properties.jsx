const utils = _decoratorUtils;

const DEBUG_SHARED_OVERRIDE = false;

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

global.type              = value => defineKey('type',           value);
global.scoped            = value => defineKey('scope',          value);
global.formDefaultTab    = value => defineKey('formDefaultTab', value);
global.formWidth         = value => defineKey('formWidth',      value);
global.formSeparator     = value => defineKey('formSeparator',  value);
global.attachedToWidget  = value => defineKey('widget',         value);

global.writeonly         = defineKey('writeonly', true);
global.hidden            = defineKey('hidden', true);

global.cellRenderer      = renderer => defineKey('cellRendererOverride',   renderer);
global.fieldRenderer     = renderer => defineKey('fieldRendererOverride',  renderer);
global.detailRenderer    = renderer => defineKey('detailRendererOverride', renderer);

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

const shared = function(proto, field, desciptor) {
	if(proto.constructor.SharedProps.indexOf(field) < 0) {
		proto.constructor.SharedProps.push(field);
	}

	return {
		...desciptor,
		configurable: true,
	};
};

global.PropertyDescriptor = class PropertyDescriptor {
	static SharedProps = [];

	type = PropertyType.VARCHAR(2**31);
	name = null;

	@shared label = 'unknown';
	@shared description = '';
	@shared placeholder = '';

	@shared primaryKey = false;
	@shared autoIncrement = false;
	@shared allowNull = true;
	@shared unique = false;
	@shared hidden = false;

	stored = false;
	defaultValue = null;
	readonly = true;
	writeonly = false;

	expr = null;
	get = null;
	set = null;
	scope = Scope.ALL;

	@shared cellRendererOverride = null;
	@shared fieldRendererOverride = null;
	@shared detailRendererOverride = null;

	@shared formDefaultTab = 'Основное';
	@shared formWidth = false;
	@shared formSeparator = FormSeparator.NONE;

	@shared widget = 'defaultWidget';

	constructor(name, data = {}) {
		this.name = name;

		this.override(data);
	}

	override(data = {}) {
		Object.assign(this, data);
	}

	linkTo(property) {
		this.constructor.SharedProps.forEach(key => {
			if(DEBUG_SHARED_OVERRIDE && this[key] != property[key]) {
				this['@overridden'] = this['@overridden'] || {};
				this['@overridden'][key] = this[key];
			}

			Object.defineProperty(this, key, {
				configurable: true,

				get() {
					return property[key];
				},

				set(value) {
					property[key] = value;
				}
			});
		});
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

	postprocess() {
		if(this.name == ID) {
			// ID props are always readonly and hidden
			this.readonly = true;
			this.hidden = true;

			// And excluded from all scopes except READ and LIST
			this.scope = this.scope & (Scope.READ | Scope.LIST);
		}

		if(this.expr && !this.set) {
			// Virtual props are readonly if they have no setter
			this.readonly = true;
		}

		if(this.writeonly) {
			// Secure props are not available for reading and only
			// Writable flags are allowed.

			// Leave only Writable flags of what's present in scope
			this.scope = this.scope & Scope.Writable;
		}
	}

	get cellRenderer() {
		return this.cellRendererOverride || this.type.cellRenderer || CellRenderers.DefaultCell;
	}

	get fieldRenderer() {
		return this.fieldRendererOverride || this.type.fieldRenderer || FieldRenderers.DefaultField;
	}

	get detailRenderer() {
		return this.detailRendererOverride || this.type.detailRenderer || this.cellRenderer;
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
