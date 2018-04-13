@modelName('ресурс')

export default class CraftResource extends BaseModel {
	// @hidden @property static usage_ingredients;
	@property static usages = {
		expr: '0',
		get() {
			return [1,2,3];
		}
	};

	@scope(Scope.VIEW)
	@property static bulk_craft_cost = {
		expr: `256 / buy_cost`,
		type: Type.TIME,
	};

	@scope(Scope.VIEW)
	@property static craft_cost;

	@scope(Scope.VIEW)
	@property static buy_cost;

	commonProp = 256;
}