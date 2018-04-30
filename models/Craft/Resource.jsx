@named('ресурс')
@registerBundle('/craft/resource')
export default class CraftResource extends PlatformSpecificModel {
	@scoped(Scope.NONE)
	@property usage_ingredients;

	@property usages = {
		async get() {
			return await this.usage_ingredients.map(usage => usage.resource);
		}
	};

	@cellRenderer(CellRenderers.LineArrayCell)
	@property ingredients;


	// @scoped(Scope.VIEW)
	@property bulk_craft_cost = {
		expr: `256 / buy_cost`,
		type: PropertyType.PRICE(19, 2),
	};


	// @scoped(Scope.VIEW)
	@property craft_cost;


	// @scoped(Scope.VIEW)
	@property buy_cost = {
		type: PropertyType.PRICE(19, 2),
	};
}