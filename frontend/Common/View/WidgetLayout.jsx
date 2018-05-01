export default class WidgetLayout extends ReactComponent {
	@prop items;

	render() {
		return (
			<div {...this.cls}>
				WidgetLayout
			</div>
		);
	}
}