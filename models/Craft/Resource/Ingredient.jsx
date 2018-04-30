global.asyncProp = function(p, f, d) {
	return d;
};

@registerBundle('/craft/resource-ingredient')
export default class CraftResourceIngredient extends PlatformSpecificModel {


	toReact() {
		return (
			<___>
				{this.quantity} x {this.ingredient.get('factories').map(factory => factory.get('name').slice(3)).call('join', ',')}
			</___>
		);
	}
}