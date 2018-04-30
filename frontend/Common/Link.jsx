

export default class Link extends ReactComponent {
	@prop href;
	@prop target;
	@prop children;

	@state action;

	async componentWillMount() {
		awaitEx(this.href || this.target, value => this.action = value);
	}

	get actionProps() {
		let action = this.action;

		let href;
		let onClick;
		let children = this.children;

		if(action instanceof FrontendModel) {
			children = children || action.name;
			href = action.viewUrl;
		}

		if(valueType(action) == Function) {
			onClick = action;
		}

		if(valueType(action) == String) {
			href = action;
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
		if(!this.action) {
			return '';
		}

		return (
			<a {...this.cls} {...this.actionProps} />
		);
	}
}