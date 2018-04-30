

export default class Link extends ReactComponent {
	@prop href;
	@prop children;

	@state target;

	async componentWillMount() {
		awaitEx(this.href, value => this.target = value);
	}

	get actionProps() {
		let target = this.target;

		let href;
		let onClick;
		let children = this.children;

		if(target instanceof FrontendModel) {
			children = target.name;
			href = target.viewUrl;
		}

		if(valueType(target) == Function) {
			onClick = target;
		}

		if(valueType(target) == String) {
			href = target;
		}

		if(href && /^(\w+:)?\/\//.test(href) == false) {
			// Local link
			const _href = href;

			onClick = ev => {
				AppController.navigate(_href);
				ev.preventDefault();
			};
		}

		return {href,children,onClick}
	}

	render() {
		if(!this.target) {
			return '';
		}

		return (
			<a {...this.cls} {...this.actionProps} />
		);
	}
}