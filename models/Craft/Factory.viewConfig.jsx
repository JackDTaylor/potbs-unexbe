import MapWidget from "../../frontend/Common/Widget/MapWidget";
import RecipesWidget from "../../frontend/Common/Widget/RecipesWidget";

export default class extends ViewConfig {
	get widgetOrder() {
		return [...super.widgetOrder, 'recipes', 'map']
	}

	columnWidths = [1,2];

	get widgets() {
		return class extends super.widgets {
			@column(0) defaultWidget;

			@column(0)
			@labeled('Рецепты')
			@widget(RecipesWidget) recipes;

			@column(1)
			@labeled('Карта')
			@widget(MapWidget) map;
		}
	}
}