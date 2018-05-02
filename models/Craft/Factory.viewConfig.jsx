import BaseWidget from "../../frontend/Common/View/Widget/BaseWidget";

export default class extends ViewConfig {
	get widgets() {
		return class extends super.widgets {
			@labeled('Рецепты')
			@widget(BaseWidget) recipes;
		}
	}
}