import WidgetWrapper from "./WidgetWrapper";

export default class WidgetLayout extends ReactComponent {
	@prop dataSource;
	@prop widgets;

	render() {
		return (
			<div {...this.cls}>
				{this.widgets.map(widget => <WidgetWrapper key={widget.name} widget={widget} />)}
			</div>
		);
	}
}