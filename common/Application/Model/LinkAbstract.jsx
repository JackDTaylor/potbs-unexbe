export default class LinkAbstract {
	propertyName;
	data;

	get type()       { return this.data.type; };
	get model()      { return this.data.model; };
	get fullKey()    { return this.data.fullKey; };
	get idKey()      { return this.data.idKey; };
	get through()    { return this.data.through; };
	get foreignKey() { return this.data.foreignKey; };
	get otherKey()   { return this.data.otherKey; };

	constructor(propertyName, data) {
		this.propertyName = propertyName;
		this.data = data;
	}

	get isId() {
		return this.propertyName == this.idKey;
	}

	get isFull() {
		return this.propertyName == this.fullKey;
	}

	get requiresSubquery() {
		return this.isFull || this.type != Link.O2M;
	}

	toJSON() {
		return this.data;
	}
}