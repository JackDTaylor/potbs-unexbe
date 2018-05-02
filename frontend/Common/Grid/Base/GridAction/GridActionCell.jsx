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

	get actionProps() {
		return {
			target: this.props.tableRow.row,
			renderMode: 'icon',
			gridActionCellProps: this.props,
		}
	}

	get actionComponents() {
		return this.actions.map((actionFn, key) => actionFn({ key, ...this.actionProps }));
	}

	render() {
		return (
			<Table.Cell>
				{this.actionComponents}
			</Table.Cell>
		);
	}
}