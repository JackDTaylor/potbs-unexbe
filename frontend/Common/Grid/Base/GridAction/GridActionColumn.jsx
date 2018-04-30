import {
	Getter,
	Template,
	Plugin,
	TemplateConnector
} from '@devexpress/dx-react-core';

import {
	isHeadingEditCommandsTableCell,
	isEditCommandsTableCell,
	isAddedTableRow,
	isEditTableRow,
	getMessagesFormatter,
} from '@devexpress/dx-grid-core';

import {
	Table,
} from "@devexpress/dx-react-grid-material-ui";

import GridActionCell from "./GridActionCell";

export default class GridActionColumn extends React.PureComponent {
	get actionsColumn() {
		return {
			key: 'editCommand',
			type: 'editCommand',
			width: GridActionCell.CalculateWidth(this.actions),
		};
	}

	columnAppender({tableColumns}) {
		return [ ...tableColumns, this.actionsColumn ];
	}

	get actions() {
		let actions = this.props.children;

		if(actions instanceof Array == false) {
			actions = [actions];
		}

		return actions.filter(x=>x);
	}

	get headingCellTemplate() {
		const stmt = {
			name: 'tableCell',
			predicate: p => isHeadingEditCommandsTableCell(p.tableRow, p.tableColumn),
		};

		return (
			<Template {...stmt} children={props => (
				<TemplateConnector>
					{(getters, actions) => <Table.StubHeaderCell {...props} />}
				</TemplateConnector>
			)} />
		);
	}

	get rowCellTemplate() {
		const stmt = {
			name: 'tableCell',
			predicate: p => isEditCommandsTableCell(p.tableRow, p.tableColumn),
		};

		return (
			<Template {...stmt} children={props => (
				<TemplateConnector>
					{(getters, actions) => (
						<GridActionCell
							{...props}
							templateGetters={getters}
							templateActions={actions}
							actions={this.actions}
							row={props.tableRow.row}
						/>
					)}
				</TemplateConnector>
			)} />
		);
	}

	render() {
		return (
			<Plugin name="TableEditColumn">
				<Getter name="tableColumns" computed={x => this.columnAppender(x)} />

				{this.headingCellTemplate}
				{this.rowCellTemplate}
			</Plugin>
		);
	}
}