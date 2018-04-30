import GridList from "./Base/GridList";
import GridFilter from "./Base/GridFilter";

export default class FilteredGrid extends ReactComponent {
	@prop provider;

	filterComponent;
	listComponent;

	render() {
		return (
			<div {...this.cls}>
				<GridFilter
					ref={e => this.filterComponent=e}
					provider={this.provider}
				/>

				<GridList
					ref={e => this.listComponent=e}
					provider={this.provider}
				/>
			</div>
		);
	}
}