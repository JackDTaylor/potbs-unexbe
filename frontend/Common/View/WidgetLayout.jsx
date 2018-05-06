import WidgetWrapper from "./WidgetWrapper";
import ColumnLayout from "../ColumnLayout";

export default class WidgetLayout extends ColumnLayout {
	@prop record;
	@prop widgets;

	get widgetColumns() {
		let columns = this.columnWidths.map(x => []);

		let unassignedWidgets = this.widgets.filter(widget => {
			let preferredColumn = parseInt(widget.column);

			if(preferredColumn >= 0) {
				columns[ Math.clamp(preferredColumn, 0, columns.length) ].push(widget);
				return false;
			}

			return true;
		});

		// Unassigned widgets will spread equally across all columns
		unassignedWidgets.forEach((widget, i) => {
			columns[ i % columns.length ].push(widget);
		});

		return columns;
	}

	renderColumn(i) {
		return this.widgetColumns[i].map(widget => (
			<WidgetWrapper key={widget.name} widget={widget} record={this.record} />
		));
	}
}