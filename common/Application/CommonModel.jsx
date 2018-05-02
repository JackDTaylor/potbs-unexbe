import LinkManyToMany from "./Model/LinkManyToMany";
import LinkManyToOne from "./Model/LinkManyToOne";
import LinkOneToMany from "./Model/LinkOneToMany";

/**
 * @static {Noun} Name
 */
@named('объект')
export default class CommonModel {
	@abstract static Code;
	@abstract static Links = {};
	@abstract static Layout = {};

	static DefineStaticGetter(name, value) {
		Object.defineProperty(this, name, {get: x=>value});
	}

	get name() {
		return this.constructor.Name.nom.ucFirst() + ' #' + this.id;
	}

	static async Prepare() {
		const me = this;

		if(this == CommonModel) {
			throw new Error("CommonModel::Prepare()");
		}

		// At this point model should have Code, Links and Layout props
		// Define accessors
		Object.keys(this.Layout).forEach(propertyName => {
			const property = this.Layout[propertyName];
			const type = property.type;

			if(property.link) {
				switch(property.link.type) {
					case Link.M2M: property.link = new LinkManyToMany(propertyName, property.link); break;
					case Link.M2O: property.link = new LinkManyToOne (propertyName, property.link); break;
					case Link.O2M: property.link = new LinkOneToMany (propertyName, property.link); break;
				}
			}

			const desc = {
				get: function() {
					let value = type.getRawValue.apply(this, [property]);

					if(property.get) {
						// Property getters are more like postprocessors
						value = property.get.apply(this, [ value ]);
					}

					return value;
				},

				set: function(val) {
					if(isUndefined(val)) {
						// Undefined cannot be set to model, it should be converted to null
						val = null;
					}

					if(property.set) {
						val = property.set.apply(this, [ val ]);

						if(property.stored == false || isUndefined(val)) {
							// For non-stored fields underlaying value is never
							// changed automatically. You can change it manually
							// by typing `this.data.prop = myValue`

							// For stored fields custom setter should return a
							// value, nothing will be set otherwise.

							return;
						}
					}

					type.setRawValue.apply(this, [val, property]);
				},

				configurable:true,
			};

			// If readonly or virtual
			if(property.writable == false) {
				desc.set = function() {
					throw new Error(`Property '${propertyName}' is readonly`);
				}
			}

			Object.defineProperty(this.prototype, propertyName, desc);
		});

		// dpr(code, this.Layout);
	}

	/**
	 * @return PropertyDescriptor[]
	 */
	static get Properties() {
		return Object.values(this.Layout);
	}

	/**
	 * @return PropertyDescriptor[]
	 */
	static get StoredProperties() {
		return this.Properties.filter(p => p.stored);
	}

	/**
	 * @return PropertyDescriptor[]
	 */
	static get VirtualProperties() {
		return this.Properties.filter(p => !p.stored);
	}

	/**
	 * @return PropertyDescriptor[]
	 */
	static get ReferentialProperties() {
		return this.Properties.filter(p => p.referential);
	}


	/**
	 * @return PropertyDescriptor[]
	 */
	static get SubqueryProperties() {
		return this.Properties.filter(p => p.referential && p.link.isId && p.subquery);
	}

	/**
	 * @param scope
	 * @return PropertyDescriptor[]
	 */
	static PropertiesByScope(scope) {
		return this.Properties.filter(p => p.scope & scope);
	}

	/**
	 * @param filter
	 * @return PropertyDescriptor[]
	 */
	static PropertiesByFilter(filter) {
		if(!filter) {
			return this.Properties;
		}

		switch(valueType(filter)) {
			case Number: return this.PropertiesByScope(filter);

			case Array: {
				if(filter.first instanceof PropertyDescriptor) {
					return filter;
				}

				const propertyNames = filter;
				filter = p => propertyNames.has(p.name);
			}
		}

		return this.Properties.filter(filter);
	}

	/**
	 * @param name
	 * @return {PropertyDescriptor}
	 */
	static PropertyByName(name) {
		return this.Layout[name] || null;
	}

	@abstract static async FindById() {}
	@abstract static async Search() {}

	data = {};
	originalData = {};
	referenceData = {};

	constructor(data) {
		if(this.constructor === CommonModel) {
			throw new Error('CommonModel class is abstract and cannot be instantiated');
		}

		this.data = {...data};
		this.originalData = {...data};
	}

	async getReferencedModel(code, id) {
		return (await this.getReferencedModels(code, [id])).first;
	}

	async getReferencedModels(code, ids) {
		return ids.map(id => ({id, code}))
	}

	get uniqueId() {
		return this.constructor.Code + ':' + this.id;
	}

	get(property) {
		return this[property];
	}

	call(method, ...args) {
		return this[method].apply(this, args);
	}

	get listUrl() {
		if(this.bundleUrl) {
			return this.bundleUrl;
		}

		return null;
	}

	get editUrl() {
		if(this.bundleUrl) {
			return `${this.bundleUrl.trimEnd('/')}/${this.id}/edit`;
		}

		return null;
	}

	get viewUrl() {
		if(this.bundleUrl) {
			return `${this.bundleUrl.trimEnd('/')}/${this.id}`;
		}

		return null;
	}

	get bundleUrl() {
		return this.constructor.BundleURL;
	}

	toJSON() {
		let data = { ...this.data };

		Object.keys(data).forEach(key => {
			const property = this.constructor.PropertyByName(key);

			if(!property) {
				delete data[key];
			}

			data[key] = property.type.encodeValue(data[key]);
		});

		return data;
	}

	static fromJSON(data) {
		data = {...data};

		Object.keys(data).forEach(key => {
			const property = this.PropertyByName(key);

			if(!property) {
				delete data[key];
			}

			data[key] = property.type.decodeValue(data[key]);
		});

		return new this(data);
	}
}