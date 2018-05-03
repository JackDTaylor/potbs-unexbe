import Embedded from "../../Embedded";

export default class GridCellRenderer extends ReactComponent {
	@prop column;
	@prop row;

	get embeddedCode() {
		return `GridListCell::${this.row.uniqueId}::${this.column.name}`;
	}

	get embeddedContents() {
		const Renderer = GetRenderer(this.column.renderer);

		return <Renderer dataSource={this.row} property={this.column} value={this.props.value} />;
	}

	render() {
		return (
			<Embedded
				code={this.embeddedCode}
				contents={this.embeddedContents}
			/>
		);
	}
}