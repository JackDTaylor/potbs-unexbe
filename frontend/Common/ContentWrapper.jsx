import Loadable from "./Loadable";

let _c = 0;

export default class ContentWrapper extends ReactComponent {
	@state component;
	@state params;

	async mount(component, params) {
		this.setState({component, params});
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
				test={++_c}
			/>
		);
	}
}