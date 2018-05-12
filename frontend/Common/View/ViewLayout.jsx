import ActionPanel from "../ActionPanel";
import Loader from "../Loader";
import WidgetLayout from "./WidgetLayout";

export default class ViewLayout extends ReactComponent {
	@prop provider;
	@prop record;

	@state columns;
	@state actions;
	@state widgets;

	async componentWillMount() {
		this.columns = this.provider.fetchColumnWidths(this.record);
		this.actions = this.provider.fetchActions(this.record);
		this.widgets = this.provider.fetchWidgets(this.record);

		this.commitState();
	}

	render() {
		if(!this.widgets) {
			return <Loader />;
		}

		return (
			<div {...this.cls}>
				<ActionPanel actions={this.actions} target={this.record} />
				<WidgetLayout columns={this.columns} widgets={this.widgets} record={this.record} />
			</div>
		);
	}
}