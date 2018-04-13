/**
 * @param Sequelize {typeof Sequelize}
 * @param sequelize {Sequelize}
 * @param preprocessors {Object}
 */
module.exports = function(Sequelize, sequelize, preprocessors, override) {
	let acl_user = sequelize.define(...preprocessors.define('acl_user', {
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		name: Sequelize.STRING,
		craft_cost: Sequelize.DECIMAL,
		buy_cost: Sequelize.DECIMAL,
	}, {
		tableName: 'acl_user',
		createdAt: 'date_created',
		updatedAt: false,
		deletedAt: false,
		name: { singular: 'user', plural: 'users' },
	}));


	let craft_resource = sequelize.define(...preprocessors.define('craft_resource', {
		id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
		name: Sequelize.STRING,
		craft_cost: Sequelize.DECIMAL,
		buy_cost: Sequelize.DECIMAL,
	}, {
		tableName: 'craft_resource',
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		name: { singular: 'resource', plural: 'resources' }
	}));

	let craft_resource_ingredient = sequelize.define(...preprocessors.define('craft_resource_ingredient', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		resource_id:   Sequelize.STRING,
		ingredient_id: Sequelize.DECIMAL,
		buy_cost:      Sequelize.DECIMAL,
	}, {
		tableName: 'craft_resource_ingredient',
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		name: {
			singular: 'resourceIngredient',
			plural: 'resourceIngredients',
		}
	}));

	let craft_factory = sequelize.define(...preprocessors.define('craft_factory', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: Sequelize.STRING,
	}, {
		tableName: 'craft_factory',
		createdAt: false,
		updatedAt: false,
		deletedAt: false,
		name: {
			singular: 'factory',
			plural: 'factories',
		}
	}));

	//LinkO2M FK_resource_ingredient_resource_id
	craft_resource.hasMany(craft_resource_ingredient, {foreignKey: 'resource_id', sourceKey: 'id', as: 'resources'});
	craft_resource_ingredient.belongsTo(craft_resource, {foreignKey: 'resource_id', targetKey: 'id'});

	//LinkO2M FK_resource_ingredient_craft_resource_id
	craft_resource.hasMany(craft_resource_ingredient, {foreignKey: 'ingredient_id', sourceKey: 'id', as: 'ingredients'});
	craft_resource_ingredient.belongsTo(craft_resource, {foreignKey: 'ingredient_id', targetKey: 'id'});

	//LinkM2M craft_factory_resource
	craft_resource.belongsToMany(craft_factory, {
		as: 'factories',
		through: 'craft_factory_resource',
		foreignKey: 'resource_id',
		otherKey: 'factory_id'
	});
	craft_factory.belongsToMany(craft_resource, {
		as: 'resources',
		through: 'craft_factory_resource',
		foreignKey: 'factory_id',
		otherKey: 'resource_id'
	});

	return {
		acl_user: acl_user,
		craft_resource: craft_resource,
		craft_resource_ingredient: craft_resource_ingredient,
		craft_factory: craft_factory,
	};
};