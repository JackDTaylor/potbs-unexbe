import GridList from "./Base/GridList";
import GridFilter from "./Base/GridFilter";

export default class FilteredGrid extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'FilteredGrid'] };

	@prop proxy;

	filterComponent;
	listComponent;

	render() {
		return (
			<div {...this.cls}>
				<GridFilter
					ref={e => this.filterComponent=e}
					proxy={this.proxy}
				/>

				<GridList
					ref={e => this.listComponent=e}
					proxy={this.proxy}
				/>
			</div>
		);
	}
}