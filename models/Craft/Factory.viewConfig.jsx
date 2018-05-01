import BaseWidget from "../../frontend/Common/View/Widget/BaseWidget";

export default class extends ViewConfig {
	get widgets() {
		return {
			...super.widgets,

			recipes: BaseWidget
		}
	}
}