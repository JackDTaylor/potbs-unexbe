global.asyncProp = function(p, f, d) {
	return d;
};

@registerBundle('/craft/resource-ingredient')
@named('Ингредиент')
export default class CraftResourceIngredient extends PlatformSpecificModel {


	toReact() {
		return (
			<___>
				{this.quantity} x {this.ingredient.get('name')}
			</___>
		);
	}
}