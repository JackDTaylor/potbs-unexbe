import Loader from "./Loader";

export default class Loadable extends ReactComponent {
	@prop c;
	@prop cRef;

	@state loadedComponent;
	@state _c = 0;

	async componentDidMount() {
		this.loadedComponent = await GetComponent(this.c);

		++this._c;
	}

	async componentWillReceiveProps(nextProps) {
		if(nextProps.c !== this.state.c) {
			this.loadedComponent = null;
			this.loadedComponent = await GetComponent(nextProps.c);
		}
	}

	render() {
		const Component = this.loadedComponent;

		if(!Component) {
			return <Loader />
		}

		return <Component ref={this.cRef} {...Object.without(this.props, ['c', 'cRef'])} _c={this._c} />;
	}
}