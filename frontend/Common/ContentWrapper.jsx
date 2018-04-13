import Loadable from "./Loadable";

let _c = 0;

export default class ContentWrapper extends ReactComponent {
	get cssClass() { return [...super.cssClass, 'ContentWrapper'] };

	@state component;
	@state params;

	async mount(component, params) {
		this.setState({component, params});
	}

	async componentWillMount() {
		this.component = this.defaultComponent;

		// let M = await GetModel('Craft/Resource');
		//
		// console.warn(`Список ${M.Name.plu.gen}`)
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