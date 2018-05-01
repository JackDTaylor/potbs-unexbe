import ActionPanel from "../ActionPanel";
import Loader from "../Loader";
import WidgetLayout from "./WidgetLayout";

export default class ViewLayout extends ReactComponent {
	@prop provider;
	@prop dataSource;

	@state actions;
	@state widgets;

	async componentWillMount() {
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
				<ActionPanel actions={this.actions} />
				<WidgetLayout items={this.widgets} />
			</div>
		);
	}
}