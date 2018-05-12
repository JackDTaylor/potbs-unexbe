import BaseWidget from "./BaseWidget";
import Caption from "../Typography/Caption";
import Empty from "../Typography/Empty";

export default class RecipesWidget extends BaseWidget {
	render() {
		(async fn => console.log(await this.record.resources))();

		return (
			<div {...this.cls}>
				{this.record.resources.map(resource => (
					<div key={resource.id}>
						<Caption variant="subheading"><b>{resource}</b></Caption>
						<div style={{marginLeft: '1em', marginBottom: '1em'}}>
							{resource.ingredients.get('length') ? (
								resource.ingredients.map(ingredient => (
									<div key={ingredient.id}>{ingredient.toReact()}</div>
								))
							) : <Empty />}
						</div>
					</div>
				))}
			</div>
		);
	}
}