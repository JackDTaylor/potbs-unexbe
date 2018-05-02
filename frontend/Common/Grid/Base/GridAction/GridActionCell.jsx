import {
	Table,
} from "@devexpress/dx-react-grid-material-ui";


export default class GridActionCell extends React.PureComponent {
	static CELL_PADDING = 32;
	static ACTION_WIDTH = 48;

	static CalculateWidth(actions) {
		return this.CELL_PADDING + [...actions].length * this.ACTION_WIDTH;
	}

	@prop actions;

	get actionComponents() {
		return this.actions.map((actionFn, key) => actionFn({
			gridActionCellProps: this.props,
			target: this.props.tableRow.row,
			key
		}));
	}

	render() {
		return (
			<Table.Cell>
				{this.actionComponents}
			</Table.Cell>
		);
	}
}