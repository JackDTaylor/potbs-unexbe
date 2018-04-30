import {
	SearchState,
	SortingState,
	DataTypeProvider,
	PagingState,
	CustomPaging,
	RowDetailState,
} from '@devexpress/dx-react-grid';

import {
	Grid,
	Toolbar,
	ColumnChooser,
	TableColumnVisibility,
	Table,
	SearchPanel,
	PagingPanel,
	TableHeaderRow,
	TableRowDetail,
} from "@devexpress/dx-react-grid-material-ui";

import {Paper} from "material-ui";
import Loader from "../../Loader";
import GridActionColumn from "./GridAction/GridActionColumn";
import EditGridAction from "./GridAction/Actions/EditGridAction";
import DeleteGridAction from "./GridAction/Actions/DeleteGridAction";
import GridAction from "./GridAction/GridAction";
import GridCellRenderer from "./GridCellRenderer";

class GridState {
	static LOADING  = 0;
	static FETCHING = 1;
	static READY    = 2;
}

export default class GridList extends ReactComponent {
	@prop provider;

	@state rows = [];
	@state columns = [];

	@state gridState = GridState.LOADING;

	@state hiddenColumnNames = [];
	@state searchValue = '';

	allowRender = false;

	@state order = new StateProperty({
		value: {},

		set(value) {
			delay(fn => this.doFetch());
			return value;
		}
	});

	@state currentPage = new StateProperty({
		value: 0,

		set(value) {
			delay(fn => this.doFetch());
			return value;
		}
	});

	@state pageSize = 1;
	@state total = 0;

	@asyncCatch async componentWillMount() {
		await this.doLoad();

		window.ggg = this;
	}

	shouldComponentUpdate(newProps, newState) {
		return this.allowRender && (
			Object.equal(newProps, this.props) == false ||
			Object.equal(newState, this.state) == false
		);
	}

	async doLoad() {
		this.gridState = GridState.LOADING;

		// console.log('GridList:CWM');

		this.columns = await this.provider.fetchColumns();

		this.hiddenColumnNames = this.columns
			.filter(c => c.property.hidden)
			.map(c => c.name);

		await this.doFetch();
	}

	get paging() {
		return {
			count: this.pageSize,
			offset: this.currentPage * this.pageSize,
		}
	}

	async doFetch() {
		this.gridState = GridState.FETCHING;
		this.commitState();

		this.rows = await this.provider.fetchData(this.filter, this.order, this.paging);
		this.total = this.provider.lastTotal;

		this.gridState = GridState.READY;
		this.commitState();
	}

	get tableMessages() {
		return {
			messages: {
				noData: this.isReady ? 'Ничего не найдено' : 'Идет загрузка...',
				noColumns: 'Не выбрано ни одной колонки',
			}
		};
	}

	preprocessSortOrder(val) {
		const invert = false;

		if((String(val).toLowerCase() == Order.ASC) != invert) {
			return Order.ASC;
		} else {
			return Order.DESC;
		}
	}

	get config() {
		return this.provider.gridConfig;
	}

	get sorting() {
		return Object.keys(this.order).map(key => ({
			columnName: key,
			direction: /*invertAscDesc*/(this.order[key])
		}));
	}

	set sorting(value) {
		this.order = Object.combine(
			value.map(x => x.columnName),
			value.map(x => /*invertAscDesc*/(x.direction)),
		);
	}

	get sortingExtensions() {
		return this.columns.map(c => ({
			columnName:     c.name,
			sortingEnabled: c.property.sortable,
		}));
	}


	get isLoading() {
		return this.gridState == GridState.LOADING;
	}

	get isFetching() {
		return this.gridState == GridState.FETCHING;
	}

	get isReady() {
		return this.gridState == GridState.READY;
	}

	get showDetailRow() {
		return this.hiddenColumnNames.filter(c => c != ID).length > 0;
	}

	onEditRowAction(p) {

		console.log(p);
	}

	onRemoveRowAction(p) {
		console.log(p);
	}

	editRowAction(p) {
		return <EditGridAction   {...p} onExecute={p.row.editUrl} />;
	}

	deleteRowAction(p) {
		return <DeleteGridAction {...p} onExecute={fn => this.onRemoveRowAction(p.row)} />;
	}

	render() {
		if(this.isLoading) {
			// console.log('GridList:Render LOADER');
			return <Loader />;
		}
		// console.log('GridList:Render FULL');

		return (
			<Paper {...this.cls}>
				{this.isFetching && <Loader />}
				<Grid rows={this.rows} columns={this.columns}>
					{this.columns.map(column => (
						<DataTypeProvider
							key={column.name}
							for={[column.name]}
							formatterComponent={GridCellRenderer}
						/>
					))}

					<SearchState value={this.searchValue} onValueChange={v => this.searchValue = v} />

					<SortingState
						sorting={this.sorting}
						onSortingChange={v => this.sorting = v}
						columnExtensions={this.sortingExtensions}
					/>
					<PagingState
						currentPage={this.currentPage}
						onCurrentPageChange={v => this.currentPage = v}

						pageSize={this.pageSize}
						onPageSizeChange={v => this.pageSize = v}
					/>
					<CustomPaging totalCount={this.total} />

					<RowDetailState />

					<Table {...this.tableMessages} />

					<TableHeaderRow showSortingControls />
					<Toolbar />
					<SearchPanel />

					<TableColumnVisibility
						{...this.tableMessages}
						defaultHiddenColumnNames={this.hiddenColumnNames}
						onHiddenColumnNamesChange={v => this.hiddenColumnNames = v}
					/>

					{this.showDetailRow && (
						<TableRowDetail
							contentComponent={data => <b>{console.log(data.row)}test</b>}
						/>
					)}

					<GridActionColumn children={[
						...this.config.rowActions,

						this.config.useEditRowAction   && (p => this.editRowAction(p)),
						this.config.useDeleteRowAction && (p => this.deleteRowAction(p)),
					]} />

					<ColumnChooser />
					<PagingPanel
						//pageSizes={[this.pageSize]}
						messages={{
							showAll:     'Все',
							rowsPerPage: 'Записей на страницу:',
							info:        '{from}-{to} из {count}',
						}}
					/>
				</Grid>
			</Paper>
		);
	}
}