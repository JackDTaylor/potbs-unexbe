import ActionPanel from "../ActionPanel";
import Loader from "../Loader";
import WidgetLayout from "./WidgetLayout";

export default class ViewLayout extends ReactComponent {
	@prop provider;
	@prop dataSource;

	@state columns;
	@state actions;
	@state widgets;

	async componentWillMount() {
		this.columns = this.provider.fetchColumnWidths(this.dataSource);
		this.actions = this.provider.fetchActions(this.dataSource);
		this.widgets = this.provider.fetchWidgets(this.dataSource);

		this.commitState();
	}

	render() {
		if(!this.widgets) {
			return <Loader />;
		}

		return (
			<div {...this.cls}>
				<ActionPanel actions={this.actions} target={this.dataSource} />
				<WidgetLayout columns={this.columns} widgets={this.widgets} dataSource={this.dataSource} />
			</div>
		);
	}
}