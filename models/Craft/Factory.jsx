@named('здание')
@registerBundle('/craft/factory')
export default class CraftFactory extends PlatformSpecificModel {
	@attachedToWidget(false)
	@formDefaultTab('Рецепты')
	@property resources;
}