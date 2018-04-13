import * as Sequelize from "sequelize";

function isVirtual(key, value, attributes, level = 0) {
	if(level > 64) {
		throw new Error('Recursion limit reached');
	}

	if(key in Sequelize.Op) {
		if(value instanceof Array === false) {
			value = [value];
		}

		return value.some(part => Object.keys(part).some(childKey => {
			return isVirtual(childKey, part[childKey], attributes, level + 1)
		}));
	}

	if(key in attributes) {
		return attributes[key].type instanceof Sequelize.DataTypes.VIRTUAL;
	}

	console.warn(`Unknown field ${key} in WHERE/HAVING clause`);

	return true;
}

export default class BackendModel extends Sequelize.Model {
	static async search(query = {}, additional = {}) {
		const where = {};
		const having = {};

		Object.keys(query).forEach(key => {
			if(isVirtual(key, query[key], this.attributes)) {
				console.log(`Adding key '${key}' to HAVING`);
				having[key] = query[key];
			} else {
				console.log(`Adding key '${key}' to WHERE`);
				where[key] = query[key];
			}
		});

		return await this.findAll({ having, where, ...additional });
	}
}