import Loadable from "./Loadable";

let _c = 0;

export default class ContentWrapper extends ReactComponent {
	@state component;
	@state params;

	@state isLoading = false;

	async mount(component, params) {
		this.component = component;
		this.params = params;

		this.commitState();
	}

	render() {
		if(!this.component) {
			return '';
		}

		return (
			<Loadable
				c={this.component}
				cRef={x => this.page=x}
				params={this.params}
			/>
		);
	}
}