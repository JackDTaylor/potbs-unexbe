@named('здание')
@registerBundle('/craft/factory')
export default class CraftFactory extends PlatformSpecificModel {
	@widget('recipes')
	@property resources;
}