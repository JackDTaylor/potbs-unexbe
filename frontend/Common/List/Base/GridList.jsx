import {
	SortingState,
	IntegratedSorting,
} from '@devexpress/dx-react-grid';

import {
	Grid,
	Table, TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import {Paper} from "material-ui";
import Loader from "../../Loader";

window.e = (p, f) => ({value:f});

class GridState {
	static LOADING  = 0;
	static FETCHING = 1;
	static READY    = 2;
}

export default class GridList extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'GridList'] };

	@prop proxy;

	@state rows = [];
	@state columns = [];
	@state gridState = GridState.LOADING;

	@asyncCatch async componentDidMount() {
		this.gridState = GridState.LOADING;
		this.columns = await this.proxy.fetchListColumns();

		this.gridState = GridState.FETCHING;
		this.rows = await this.proxy.fetchListData();

		this.gridState = GridState.READY;
	}

	get tableMessages() {
		return {
			noData: 'Ничего не найдено',
		}
	}

	changeSorting(sorting) {
		this.setState({
			sorting,
		});
	}

	render() {
		if(this.gridState != GridState.READY) {
			return <Loader />;
		}

		return (
			<Paper {...this.cls}>
				{this.isLoading && <Loader />}
				<Grid rows={this.rows} columns={this.columns}>
					{/*<SortingState*/}
					{/*defaultSorting={[{ columnName: 'product', direction: 'asc' }]}*/}
					{/*/>*/}
					{/*<IntegratedSorting />*/}

					<Table messages={this.tableMessages} />{/*showSortingControls*/}
					<TableHeaderRow />
				</Grid>
			</Paper>
		);
	}
}