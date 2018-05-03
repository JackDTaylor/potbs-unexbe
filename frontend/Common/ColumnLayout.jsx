export default class ColumnLayout extends ReactComponent {
	@prop columns;

	get columnWidths() {
		let columnWidths = this.columns;

		if(empty(columnWidths) || columnWidths instanceof Array == false) {
			columnWidths = [1];
		}

		return columnWidths;
	}

	renderColumn(i) {}

	render() {
		let widths = this.columnWidths;

		return (
			<div {...this.cls}>
				{widths.map((width, i) => (
					<div key={i} className="column" style={{flex: width}}>
						{this.renderColumn(i)}
					</div>
				))}
			</div>
		);
	}
}