@named('здание')
@registerBundle('/craft/factory')
export default class CraftFactory extends PlatformSpecificModel {
	@attachedToWidget('recipes')
	@property resources;
}